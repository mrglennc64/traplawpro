import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matter, trackName, contributors } = body;

    // Generate unique verification ID
    const verificationId = `HANDSHAKE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // In production, save to database
    // await db.handshakes.create({ ... })

    // Generate the signing link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const signingLink = `${baseUrl}/studio-mode/${verificationId}`;

    return NextResponse.json({
      success: true,
      verificationId,
      signingLink,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create handshake' },
      { status: 500 }
    );
  }
}