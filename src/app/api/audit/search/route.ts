import prices from "@/lib/data/prices.json";
import { Price } from "@/lib/data/types";
import { NextRequest, NextResponse } from "next/server";

// --- EXISTING DATA & TYPES ---
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

export interface UserIncomeData {
  monthlyNetIncome: number;
  hoursWorkedPerWeek: number;
}

export interface ConversionResult {
  totalHours: number;
  formattedTime: string;
  shareableQuote: string;
}

// --- RATE LIMITING ---
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

// --- UTILITIES ---
function sanitizeInput(input: string): string {
  // Remove any HTML tags and special characters that could be used for XSS
  return input
    .replace(/[<>\"']/g, "")
    .replace(/[^\w\s\-\.,()\[\]]/g, "")
    .trim()
    .slice(0, 100); // Limit length
}

function calculateTimeCost(price: number, incomeData: UserIncomeData, itemName: string = "this item"): ConversionResult {
  const monthlyHoursWorked = incomeData.hoursWorkedPerWeek * 4.33;
  const trueHourlyWage = incomeData.monthlyNetIncome / monthlyHoursWorked;
  const totalHours = price / trueHourlyWage;

  const workingDays = Math.floor(totalHours / 8);
  const remainingHours = Math.round(totalHours % 8);

  let formattedTime = "";
  if (workingDays > 0) formattedTime += `${workingDays} working days `;
  if (remainingHours > 0 || workingDays === 0) formattedTime += `${remainingHours} hours`;

  const shareableQuote = `Is ${itemName} really worth ${formattedTime.trim()} of your life? 🤔 Find out your true purchase power with Viluva AI.`;

  return {
    totalHours: Number(totalHours.toFixed(2)),
    formattedTime: formattedTime.trim(),
    shareableQuote
  };
}

// Helper to attach security headers
function attachSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

function getClientIdentifier(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";
}

// --- ROUTE HANDLERS ---

// 1. GET: Existing Price Search
export async function GET(request: NextRequest) {
  const identifier = getClientIdentifier(request);

  if (!checkRateLimit(identifier)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": "60" },
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const tier = searchParams.get("tier");

  if (!query || !tier) {
    return attachSecurityHeaders(NextResponse.json({ error: "Missing query or tier" }, { status: 400 }));
  }

  const sanitizedQuery = sanitizeInput(query);
  const sanitizedTier = sanitizeInput(tier);

  if (sanitizedQuery.length === 0 || sanitizedTier.length === 0) {
    return attachSecurityHeaders(NextResponse.json({ error: "Invalid input parameters" }, { status: 400 }));
  }

  const romanTier = tierMap[sanitizedTier];
  if (!romanTier) {
    return attachSecurityHeaders(NextResponse.json({ error: `Invalid tier: ${sanitizedTier}` }, { status: 400 }));
  }

  const filteredPrices = (prices as Price[]).filter((price) => {
    return (
      price.tier === romanTier &&
      price.name.toLowerCase().includes(sanitizedQuery.toLowerCase())
    );
  });

  return attachSecurityHeaders(NextResponse.json(filteredPrices));
}

// 2. POST: "Time = Money" Converter
export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);

  if (!checkRateLimit(identifier)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": "60" },
      },
    );
  }

  try {
    const body = await request.json();
    const { price, itemName, monthlyNetIncome, hoursWorkedPerWeek = 40 } = body;

    if (!price || !monthlyNetIncome || isNaN(price) || isNaN(monthlyNetIncome)) {
      return attachSecurityHeaders(NextResponse.json(
        { error: 'Valid price and monthlyNetIncome are required.' }, 
        { status: 400 }
      ));
    }

    // Sanitize the item name before using it in the quote to prevent XSS
    const sanitizedItemName = itemName ? sanitizeInput(String(itemName)) : 'this item';

    const incomeData = { 
      monthlyNetIncome: Number(monthlyNetIncome), 
      hoursWorkedPerWeek: Number(hoursWorkedPerWeek) 
    };
    
    const result = calculateTimeCost(Number(price), incomeData, sanitizedItemName);

    return attachSecurityHeaders(NextResponse.json({ success: true, data: result }));
  } catch (error) {
    return attachSecurityHeaders(NextResponse.json(
      { error: 'Invalid request body' }, 
      { status: 500 }
    ));
  }
}

// 3. OPTIONS: Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}