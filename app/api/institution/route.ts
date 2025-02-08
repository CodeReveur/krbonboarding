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

    let query = "SELECT * FROM institutions";
   
    const params: any[] = [];

    const conditions = [];
    if (filter) {
      conditions.push(`status = $${params.length + 1} OR payment_status = $${params.length + 1}`);
      params.push(filter);
    }
    if (search) {
      conditions.push(`(name ILIKE $${params.length + 1} OR hd_address ILIKE $${params.length + 1} OR CAST(id AS TEXT) ILIKE $${params.length + 1} OR contact ILIKE $${params.length + 1} OR hashed_id ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Sorting
    if (sort) {
      if (sort === "new") {
        query += " ORDER BY CAST(created_at AS DATE) DESC";
      } else if (sort === "old") {
        query += " ORDER BY CAST(created_at AS DATE) ASC";
      }else if (sort === "name") {
        query += " ORDER BY name ASC";
      }
    } else {
      query += " ORDER BY id DESC";
    }

    const result = await client.query(query, params);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error retrieving institutions:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
