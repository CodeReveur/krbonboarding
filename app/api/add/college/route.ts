import { NextRequest, NextResponse } from "next/server";
import client from "../../utils/db";
import uploadDocumentToSupabase from "../../utils/supabase";

// Define types for the college request
type collegeRequest = {
  name: string;
  address: string;
  contact: string;
  institution: string;
  logo: File;
};


// Helper function to hash the college ID
async function hashId(id: number): Promise<string> {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(id.toString());
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
// Handle POST request for adding a college
export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();
  const collegeData: collegeRequest = {
    name: formData.get('name')?.toString() || '',
    address: formData.get('address')?.toString() || '',
    contact: formData.get('contact')?.toString() || '',
    institution: formData.get('institution')?.toString() || '',
    logo: formData.get('logo') as File, // Get the logo file directly
  };

  console.log("Received data: ", collegeData); // Log the college data for debugging

  // Validate required fields
  if (!collegeData.name || !collegeData.contact || !collegeData.address || !collegeData.institution) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    // Upload the logo to Cloudinary
    const logo = await uploadDocumentToSupabase(collegeData.logo, collegeData.name);
    const status = "Pending";

    // Insert college into the database
    const result = await client.query(
      `INSERT INTO colleges (name, address, contact, status, institution, logo, hashed_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
      [collegeData.name, collegeData.address, collegeData.contact, status, collegeData.institution, logo, hashId]
    );
    const collegeId = result.rows[0].id;

    // Hash the college ID
    const hashedcollegeId = await hashId(collegeId);

    // Update the college with the hashed ID (for additional usage in the response)
    await client.query(
      `UPDATE colleges SET hashed_id = $1 WHERE id = $2`,
      [hashedcollegeId, collegeId]
    );
  
    return NextResponse.json({ message: "college added successfully", college: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error during college addition:", error); // Log only the message
    return NextResponse.json(
        { message: "college addition failed", error: error }, 
        { status: 500 }
    );
}

}
