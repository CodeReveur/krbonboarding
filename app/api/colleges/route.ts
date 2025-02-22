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
    const session_id = searchParams.get("institution_id")
    let query = `SELECT 
      c.id,
      c.name,
      c.address,
      c.status,
      c.contact,
      c.created_at,
      c.logo,
      i.name AS institute
      FROM colleges c
      JOIN institutions i ON CAST(i.id AS TEXT) = c.institution  -- FIXED JOIN
      WHERE c.institution = $1
      `;
   
    const params: any[] = [session_id];

    const conditions = [];
    if (filter) {
      conditions.push(`c.status = $${params.length + 1}`);
      params.push(filter);
    }
    if (search) {
      conditions.push(`(c.name ILIKE $${params.length + 1} OR c.address ILIKE $${params.length + 1} OR c.label ILIKE $${params.length + 1} OR c.contact ILIKE $${params.length + 1} OR c.hashed_id ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length) {
      query += ` AND ${conditions.join(" AND ")}`;
    }

    // Sorting
    if (sort) {
      if (sort === "new") {
        query += " ORDER BY CAST(c.created_at AS DATE) DESC";
      } else if (sort === "old") {
        query += " ORDER BY CAST(c.created_at AS DATE) ASC";
      }else if (sort === "name") {
        query += " ORDER BY c.name ASC";
      }
    } else {
      query += " ORDER BY c.id DESC";
    }

    const result = await client.query(query, params);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error retrieving colleges:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
