import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing participant ID' }, { status: 400 });
    }

    const csvPath = path.join(process.cwd(), 'src/data/database.csv');
    
    // Read the CSV and find the user
    const participant = await new Promise((resolve, reject) => {
      let foundUser = null;
      fs.createReadStream(csvPath)
        .pipe(csvParser())
        .on('data', (row) => {
          if (row.id === id) {
            foundUser = row;
          }
        })
        .on('end', () => {
          resolve(foundUser);
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      participant: {
        name: participant.name,
        email: participant.email,
        role: participant.role,
        timestamp: participant.timestamp
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
