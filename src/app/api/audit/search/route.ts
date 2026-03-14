import prices from "@/lib/data/prices.json";
import { Price } from "@/lib/data/types";
import { NextRequest, NextResponse } from "next/server";

const tierMap: { [key: string]: string } = {
  "Tier 1": "I",
  "Tier 2": "II",
  "Tier 3": "III",
  "TIER 1": "I",
  "TIER 2": "II",
  "TIER 3": "III",
  "tier 1": "I",
  "tier 2": "II",
  "tier 3": "III",
};

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = 100; // 100 requests per minute per IP
  const windowMs = 60 * 1000; // 1 minute

  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

function sanitizeInput(input: string): string {
  // Remove any HTML tags and special characters that could be used for XSS
  return input
    .replace(/[<>\"']/g, "")
    .replace(/[^\w\s\-\.,()\[\]]/g, "")
    .trim()
    .slice(0, 100); // Limit length
}

export async function GET(request: NextRequest) {
  // Get client identifier (IP address or forwarded IP)
  const identifier =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Check rate limit
  if (!checkRateLimit(identifier)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const tier = searchParams.get("tier");

  if (!query || !tier) {
    return NextResponse.json(
      { error: "Missing query or tier" },
      { status: 400 },
    );
  }

  // Sanitize inputs to prevent XSS
  const sanitizedQuery = sanitizeInput(query);
  const sanitizedTier = sanitizeInput(tier);

  if (sanitizedQuery.length === 0 || sanitizedTier.length === 0) {
    return NextResponse.json(
      { error: "Invalid input parameters" },
      { status: 400 },
    );
  }

  const romanTier = tierMap[sanitizedTier];
  if (!romanTier) {
    return NextResponse.json(
      { error: `Invalid tier: ${sanitizedTier}` },
      { status: 400 },
    );
  }

  const filteredPrices = (prices as Price[]).filter((price) => {
    return (
      price.tier === romanTier &&
      price.name.toLowerCase().includes(sanitizedQuery.toLowerCase())
    );
  });

  // Add security headers and CORS
  const response = NextResponse.json(filteredPrices);

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // CORS headers (adjust origin as needed for production)
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
