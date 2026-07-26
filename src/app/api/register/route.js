import { NextResponse } from 'next/server';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, role, passcode } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const userId = uuidv4();
    const timestamp = new Date().toISOString();
    const userRole = role || 'ATTENDEE';

    if (userRole !== 'ATTENDEE' && passcode !== '1234') {
      return NextResponse.json(
        { error: 'Invalid passcode for privileged role.' },
        { status: 403 }
      );
    }

    // Path to CSV file
    const csvPath = path.join(process.cwd(), 'src/data/database.csv');

    // Setup CSV Writer in append mode
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'id', title: 'id' },
        { id: 'name', title: 'name' },
        { id: 'email', title: 'email' },
        { id: 'role', title: 'role' },
        { id: 'timestamp', title: 'timestamp' },
      ],
      append: true,
    });

    const record = [
      {
        id: userId,
        name,
        email,
        role: userRole,
        timestamp,
      },
    ];

    await csvWriter.writeRecords(record);

    // Generate QR Code containing the User ID
    const qrCodeDataUrl = await QRCode.toDataURL(userId, {
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      userId,
      qrCode: qrCodeDataUrl,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
