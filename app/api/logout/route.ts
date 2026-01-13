import { deleteSession } from '@/app/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await deleteSession();
    
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}

export async function GET() {
  await deleteSession();
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL));
}