import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('subscribers')
    .insert([{ email }]);

  if (error) {
    console.error('Supabase error:', error);
    // Handle specific errors, e.g., unique constraint violation
    if (error.code === '23505') { // unique_violation
        return NextResponse.json({ error: 'This email is already subscribed.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'An error occurred while subscribing. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 201 });
}
