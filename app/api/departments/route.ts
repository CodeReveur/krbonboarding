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
      d.id,
      d.name,
      d.label,
      d.status,
      d.created_at,
      i.name AS institute,
      c.name AS college,
      s.name AS school
      FROM departments d
      JOIN schools s ON CAST(s.id AS TEXT) = d.school
      JOIN colleges c ON s.id = c.id
      JOIN institutions i ON c.id = i.id 
      
      `;
   
    const params: any[] = [];

    const conditions = [];
    if (filter) {
      conditions.push(`d.status = $${params.length + 1}`);
      params.push(filter);
    }
    if (search) {
      conditions.push(`(d.name ILIKE $${params.length + 1} OR d.label ILIKE $${params.length + 1} OR d.hashed_id ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Sorting
    if (sort) {
      if (sort === "new") {
        query += " ORDER BY CAST(d.created_at AS DATE) DESC";
      } else if (sort === "old") {
        query += " ORDER BY CAST(d.created_at AS DATE) ASC";
      }else if (sort === "name") {
        query += " ORDER BY d.name ASC";
      }
    } else {
      query += " ORDER BY d.id DESC";
    }

    const result = await client.query(query, params);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error retrieving departments:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
