export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import client from "../../utils/db"; // Adjust the path as needed

export async function GET() {
  try {
    // Query to fetch institution statistics
    const query = `
      SELECT 
        COUNT(*) AS total_institutions,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS total_pending,
        SUM(CASE WHEN status ='Active' THEN 1 ELSE 0 END) AS total_active,
        SUM(CASE WHEN payment_status = 'Maintained' THEN 1 ELSE 0 END) AS total_maintained,
        SUM(CASE WHEN status = 'Blocked' OR payment_status = 'Initial' THEN 1 ELSE 0 END) AS total_inactive,
        SUM(CASE WHEN payment_status = 'Exceeded' THEN 1 ELSE 0 END) AS total_exceed_payments
      FROM institutions;
    `;

    // Execute the query
    const result = await client.query(query);

    // Extract data
    const data = result.rows[0] || {};

    // Prepare response
    const response = {
      total_institutions: parseInt(data.total_institutions || "0"),
      total_active: parseInt(data.total_active || "0"),
      total_pending: parseInt(data.total_pending || "0"),
      total_maintained: parseInt(data.total_maintained || "0"),
      total_inactive: parseInt(data.total_inactive || "0"),
      total_exceed_payments: parseInt(data.total_exceed_payments || "0"),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error retrieving institution analytics:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
 