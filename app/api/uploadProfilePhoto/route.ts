import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as Blob | null;
  const email = formData.get('email') as string;

  if (!file || !email) {
    return NextResponse.json({ message: 'File or email is missing' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), 'public', 'profile-photos');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, `${email.replace('@', '_')}.jpg`);
  
  try {
    fs.writeFileSync(filePath, new Uint8Array(buffer));
    return NextResponse.json({ message: 'Profile photo uploaded successfully' });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ message: 'Failed to save the file' }, { status: 500 });
  }
}
