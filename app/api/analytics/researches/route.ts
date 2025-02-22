export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import client from "@/app/api/utils/db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    // Get the current month and last month
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const currentYear = new Date().getFullYear();
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const session_id = searchParams.get("institution_id");

    // Query for total uploads across all time
    const queryTotalUploads = `SELECT COUNT(*) AS total_uploads FROM researches;`;

    // Query for current and last month statistics
    const query = `
      SELECT 
        COUNT(*) AS total_researches,
        SUM(CASE WHEN status = 'Pending' OR status = 'Under review' OR status = 'Draft' THEN 1 ELSE 0 END) AS pending_researches,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS total_rejected,
        SUM(CASE WHEN status = 'On hold' THEN 1 ELSE 0 END) AS total_onhold,
        SUM(CASE WHEN status = 'Published' OR status ='Approved' THEN 1 ELSE 0 END) AS total_published,
        SUM(downloads) AS total_downloads
      FROM researches WHERE CAST(institution AS TEXT) = CAST($1 AS TEXT) AND EXTRACT(MONTH FROM CAST(created_at AS DATE)) = $2 AND EXTRACT(YEAR FROM CAST(created_at AS DATE)) = $3
    `;

    const lastMonthQuery = `
      SELECT 
        COUNT(*) AS total_researches,
        SUM(CASE WHEN status = 'Pending' OR status = 'Under review' THEN 1 ELSE 0 END) AS pending_researches,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS total_rejected,
        SUM(CASE WHEN status = 'On hold' THEN 1 ELSE 0 END) AS total_onhold,
        SUM(CASE WHEN status = 'Published' OR status ='Approved' THEN 1 ELSE 0 END) AS total_published,
        SUM(downloads) AS total_downloads
       FROM researches WHERE CAST(institution AS TEXT) = CAST($1 AS TEXT) AND EXTRACT(MONTH FROM CAST(created_at AS DATE)) = $2 AND EXTRACT(YEAR FROM CAST(created_at AS DATE)) = $3
`;

    // Execute queries
    const totalUploadsData = await client.query(queryTotalUploads);
    const currentResult = await client.query(query, [session_id, currentMonth, currentYear]);
    const lastMonthResult = await client.query(lastMonthQuery, [session_id, lastMonth, lastMonthYear]);

    const totalUploads = totalUploadsData.rows[0].total_uploads || 1;
    const current = currentResult.rows[0];
    const previous = lastMonthResult.rows[0];

    // Function to calculate percentage change
    const calculatePercentage = (current: number, previous: number) => {
      const currentPercentage = (current / totalUploads) * 100;
      const previousPercentage = (previous / totalUploads) * 100;
      return parseFloat((currentPercentage - previousPercentage).toFixed(2));
    };
    const analytics = {
      total_researches:current.total_researches || 0,
      pending_researches:current.pending_researches || 0,
      total_rejected:current.total_rejected || 0,
      total_onhold:current.total_onhold || 0,
      total_published:current.total_published || 0,
      total_downloads:current.total_downloads || 0,
      percentage_change: {
        total_researches: calculatePercentage(current.total_researches, previous.total_researches),
        pending_researches: calculatePercentage(current.pending_researches, previous.pending_researches),
        total_rejected: calculatePercentage(current.total_rejected, previous.total_rejected),
        total_onhold: calculatePercentage(current.total_onhold, previous.total_onhold),
        total_published: calculatePercentage(current.total_published, previous.total_published),
        total_downloads: calculatePercentage(current.total_downloads, previous.total_downloads),
      }
    };

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error("Error retrieving research analytics:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
