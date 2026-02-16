
import { NextRequest, NextResponse } from 'next/server';
import prices from '@/lib/data/prices.json';
import { Price } from '@/lib/data/types';

const tierMap: { [key: string]: string } = {
  'Tier 1': 'I',
  'Tier 2': 'II',
  'Tier 3': 'III',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const tier = searchParams.get('tier');

  if (!query || !tier) {
    return NextResponse.json({ error: 'Missing query or tier' }, { status: 400 });
  }

  const romanTier = tierMap[tier];
  if (!romanTier) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  const filteredPrices = (prices as Price[]).filter((price) => {
    return (
      price.tier === romanTier &&
      price.name.toLowerCase().includes(query.toLowerCase())
    );
  });

  return NextResponse.json(filteredPrices);
}
