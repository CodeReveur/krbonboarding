import { NextRequest, NextResponse } from "next/server";
import client from "../../utils/db";
const cloudinary = require('../../utils/cloudinary');
const fs = require('fs');
const path = require('path');
const os = require('os'); // Import os to get the temporary directory

// Define types for the school request
type schoolRequest = {
  name: string;
  address: string;
  contact: string;
  college: string;
  logo: File;
};

// Helper to upload logo to Cloudinary
async function uploadLogoToCloudinary(file: File): Promise<string> {
  const tempDir = os.tmpdir(); // Use OS temporary directory
  const logoPath = path.join(tempDir, file.name); // Save the file with its original name
  const buffer = await file.arrayBuffer(); // Get the file's buffer
  fs.writeFileSync(logoPath, Buffer.from(buffer)); // Write the buffer to a file

  // Upload the logo to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(logoPath, {
    use_filename: true,
    folder: 'institutions/schools/logos',
  });
  
  fs.unlinkSync(logoPath); // Remove the temporary file after upload
  return uploadResult.secure_url; // Return the uploaded logo's URL
}

// Helper function to hash the school ID
async function hashId(id: number): Promise<string> {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(id.toString());
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
// Handle POST request for adding a school
export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();
  const schoolData: schoolRequest = {
    name: formData.get('name')?.toString() || '',
    address: formData.get('address')?.toString() || '',
    contact: formData.get('contact')?.toString() || '',
    college: formData.get('college')?.toString() || '',
    logo: formData.get('logo') as File, // Get the logo file directly
  };

  console.log("Received data: ", schoolData); // Log the school data for debugging

  // Validate required fields
  if (!schoolData.name || !schoolData.contact || !schoolData.address || !schoolData.college) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    // Upload the logo to Cloudinary
    const logo = await uploadLogoToCloudinary(schoolData.logo);
    const status = "Pending";

    // Insert school into the database
    const result = await client.query(
      `INSERT INTO schools (name, address, contact, status, college, logo, hashed_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
      [schoolData.name, schoolData.address, schoolData.contact, status, schoolData.college, logo, hashId]
    );
    const schoolId = result.rows[0].id;

    // Hash the school ID
    const hashedschoolId = await hashId(schoolId);

    // Update the school with the hashed ID (for additional usage in the response)
    await client.query(
      `UPDATE schools SET hashed_id = $1 WHERE id = $2`,
      [hashedschoolId, schoolId]
    );
  
    return NextResponse.json({ message: "school added successfully", school: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error during school addition:", error); // Log only the message
    return NextResponse.json(
        { message: "school addition failed", error: error }, 
        { status: 500 }
    );
}

}
