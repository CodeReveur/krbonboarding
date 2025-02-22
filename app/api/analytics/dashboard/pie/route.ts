export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import client from "@/app/api/utils/db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("institution_id");

    // Query for research statistics
    const query = `
      SELECT 
        SUM(CASE WHEN status = 'Pending' OR status = 'Under review' THEN 1 ELSE 0 END) AS pending_researches,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS total_rejected,
        SUM(CASE WHEN status = 'On hold' OR status = 'Draft' OR status = 'Rejected' THEN 1 ELSE 0 END) AS total_inactive,
        SUM(CASE WHEN status = 'Published' OR status = 'Approved' THEN 1 ELSE 0 END) AS total_published
      FROM researches 
      WHERE institution::TEXT = $1
    `;

    const result = await client.query(query, [session_id]);

    // Extract row data properly
    const row = result.rows[0] || {};

    // Construct response
    const analytics = {
      pending_researches: row.pending_researches,
      total_rejected: row.total_rejected,
      total_inactive: row.total_inactive,
      total_published: row.total_published,
    };

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error("Error retrieving research analytics:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
