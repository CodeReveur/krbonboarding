export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import client from "../utils/db"; // Adjust path as needed

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query parameters safely
    const session_id = searchParams.get("institution_id")?.trim() || "";
    const filter = searchParams.get("filter")?.trim() || "";
    const search = searchParams.get("search")?.trim() || "";
    const sort = searchParams.get("sort")?.trim() || "";

    // Ensure institution_id exists
    if (!session_id) {
      return NextResponse.json({ message: "Missing institution_id" }, { status: 400 });
    }

    let query = `
      SELECT 
        r.id, r.title, r.researcher, r.status, r.progress_status,
        r.year, r.abstract, r.document, r.document_type, r.url, 
        r.category, r.hashed_id, r.created_at, 
        i.name AS institute, s.name AS school
      FROM researches r
      JOIN institutions i ON CAST(i.id AS TEXT) = r.institution
      JOIN schools s ON CAST(s.id AS TEXT) = r.school
      WHERE r.institution = $1
    `;

    const params: any[] = [session_id];

    // Filters and Conditions
    const conditions = [];

    if (filter) {
      conditions.push(`r.status = $${params.length + 1}`);
      params.push(filter);
    }

    if (search) {
      conditions.push(`
        (r.title ILIKE $${params.length + 1} OR 
         r.researcher ILIKE $${params.length + 1} OR 
         r.url ILIKE $${params.length + 1} OR 
         r.category ILIKE $${params.length + 1} OR 
         r.year ILIKE $${params.length + 1})
      `);
      params.push(`%${search}%`);
    }

    if (conditions.length) {
      query += ` AND ${conditions.join(" AND ")}`;
    }

    // Sorting Logic
    if (sort) {
      if (sort === "new") {
        query += " ORDER BY r.created_at DESC";
      } else if (sort === "old") {
        query += " ORDER BY r.created_at ASC";
      } else if (sort === "title") {
        query += " ORDER BY r.title ASC";
      }
    } else {
      query += " ORDER BY r.id DESC";
    }

    // Execute Query
    const result = await client.query(query, params);
    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error("Error retrieving researches:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
