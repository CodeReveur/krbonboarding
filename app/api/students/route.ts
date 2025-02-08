export const dynamic = "force-dynamic";



import { NextResponse } from "next/server";
import client from "../utils/db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    const filter = searchParams.get("filter");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    let query = `SELECT 
      s.id,
      s.first_name,
      s.last_name,
      s.email,
      s.phone,
      s.password,
      s.status,
      s.created_at,
      s.hashed_id,
      s.profile_picture,
      i.name AS institute,
      c.name AS college,
      sc.name AS school,
      d.name AS department
      FROM students s
      JOIN departments d ON CAST(d.id AS TEXT) = s.department
      JOIN schools sc ON sc.id = d.id
      JOIN colleges c ON c.id = sc.id
      JOIN institutions i ON i.id = c.id 
      `;
   
    const params: any[] = [];

    const conditions = [];
    if (filter) {
      conditions.push(`s.status = $${params.length + 1}`);
      params.push(filter);
    }
    if (search) {
      conditions.push(`(s.verification_code ILIKE $${params.length + 1} OR s.first_name ILIKE $${params.length + 1} OR s.last_name ILIKE $${params.length + 1} OR s.email ILIKE $${params.length + 1} OR s.status ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Sorting
    if (sort) {
      if (sort === "new") {
        query += " ORDER BY CAST(s.created_at AS DATE) DESC";
      } else if (sort === "old") {
        query += " ORDER BY CAST(s.created_at AS DATE) ASC";
      }else if (sort === "name") {
        query += " ORDER BY s.name ASC";
      }
    } else {
      query += " ORDER BY s.id DESC";
    }

    const result = await client.query(query, params);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error retrieving students:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
