import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export const GET = async () => {
  return NextResponse.json({ message: 'Hello World' });
};
export const POST = async () => {
  return NextResponse.json({ message: 'Hello World' });
};
