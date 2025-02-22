import { NextRequest, NextResponse } from "next/server";

import client from "../../utils/db";
import { sendAccountCreationEmail, sendAccountVerificationSMS } from "../../utils/config";
const cloudinary = require('../../utils/cloudinary');
const fs = require('fs');
const path = require('path');
const os = require('os'); // Import os to get the temporary directory


// Define types for the supervisor request
type supervisorRequest = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  school: string;
  profilePicture: File;
};

// Helper to upload profile picture to Cloudinary
async function uploadProfilePictureToCloudinary(file: File): Promise<string> {
  const tempDir = os.tmpdir();
  const profilePicturePath = path.join(tempDir, file.name);
  const buffer = await file.arrayBuffer();
  fs.writeFileSync(profilePicturePath, Buffer.from(buffer));

  const uploadResult = await cloudinary.uploader.upload(profilePicturePath, {
    use_filename: true,
    folder: "supervisors/profile_pictures",
  });

  fs.unlinkSync(profilePicturePath);
  return uploadResult.secure_url;
}


// Helper function to hash the supervisor ID
async function hashId(id: number): Promise<string> {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(id.toString());
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Handle POST request for adding a supervisor
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const supervisorData: supervisorRequest = {
      first_name: formData.get("first_name")?.toString() || "",
      last_name: formData.get("last_name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      dob: formData.get("dob")?.toString() || "",
      school: formData.get("school")?.toString() || "",
      profilePicture: formData.get("profilePicture") as File,
    };

    if (
      !supervisorData.first_name ||
      !supervisorData.last_name ||
      !supervisorData.email ||
      !supervisorData.dob||
      !supervisorData.school ||
      !supervisorData.phone
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const profilePicture = await uploadProfilePictureToCloudinary(supervisorData.profilePicture);
    const status = "Pending";

    const result = await client.query(
      `INSERT INTO supervisors (first_name, last_name, email, status, phone, school, dob, profile_picture, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8,  NOW(), NOW()) RETURNING id`,
      [
        supervisorData.first_name,
        supervisorData.last_name,
        supervisorData.email,
        status,
        supervisorData.phone,
        supervisorData.school,
        supervisorData.dob,
        profilePicture
      ]
    );

    const supervisorId = result.rows[0].id;
    const hashedsupervisorId = await hashId(supervisorId);

    await client.query(`UPDATE supervisors SET hashed_id = $1 WHERE id = $2`, [
      hashedsupervisorId,
      supervisorId,
    ]);

    await sendAccountCreationEmail (supervisorData.email, supervisorData.first_name)
    return NextResponse.json(
      { message: "supervisor added successfully", supervisor: { id: supervisorId, hashed_id: hashedsupervisorId, email: supervisorData.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during supervisor addition:", error);
    return NextResponse.json(
      { message: "supervisor addition failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}
