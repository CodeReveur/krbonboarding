export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import client from "../../utils/db"; // Adjust the path as needed

export async function GET() {
  try {
    // Query to fetch institution statistics
    const query = `
      SELECT 
        COUNT(*) AS total_departments,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS total_pending,
        SUM(CASE WHEN status ='Active' THEN 1 ELSE 0 END) AS total_active,
        SUM(CASE WHEN status = 'Blocked' OR status = 'Inactive' THEN 1 ELSE 0 END) AS total_inactive
      FROM departments;
    `;

    // Execute the query
    const result = await client.query(query);

    // Extract data
    const data = result.rows[0] || {};

    // Prepare response
    const response = {
      total_departments: parseInt(data.total_departments || "0"),
      total_active: parseInt(data.total_active || "0"),
      total_pending: parseInt(data.total_pending || "0"),
      total_inactive: parseInt(data.total_inactive || "0"),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error retrieving institution analytics:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
 