export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import client from "@/app/api/utils/db"; // Adjust the path as needed

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const institution_id = searchParams.get("institution_id");
    const currentMonth = new Date().getMonth() + 1;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const currentYear = new Date().getFullYear();
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

// Queries for overall counts
const totalCountsQuery = `
  SELECT 
    (SELECT COUNT(*) FROM researches WHERE CAST(institution AS TEXT) = CAST($1 AS TEXT)) AS total_researches,
    (SELECT 
     COUNT(*) 
     FROM supervisors
     JOIN schools ON CAST(schools.id AS TEXT) = CAST(supervisors.school AS TEXT)
     JOIN colleges ON CAST(colleges.id AS TEXT) = CAST(schools.college AS TEXT)
     JOIN institutions ON CAST(institutions.id AS TEXT) = CAST(colleges.institution AS TEXT)
     WHERE CAST(institutions.id AS TEXT) = CAST($1 AS TEXT)) AS total_supervisors,
    (SELECT 
     COUNT(*) 
     FROM students 
     JOIN departments ON CAST(departments.id AS TEXT) = CAST(students.department AS TEXT)
     JOIN schools ON CAST(schools.id AS TEXT) = CAST(departments.school AS TEXT)
     JOIN colleges ON CAST(colleges.id AS TEXT) = CAST(schools.college AS TEXT)
     JOIN institutions ON CAST(institutions.id AS TEXT) = CAST(colleges.institution AS TEXT)
     WHERE CAST(institutions.id AS TEXT) = CAST($1 AS TEXT)) AS total_students,
    (SELECT 
     COUNT(*) 
     FROM students 
     JOIN departments ON CAST(departments.id AS TEXT) = CAST(students.department AS TEXT)
     JOIN schools ON CAST(schools.id AS TEXT) = CAST(departments.school AS TEXT)
     JOIN colleges ON CAST(colleges.id AS TEXT) = CAST(schools.college AS TEXT)
     JOIN institutions ON CAST(institutions.id AS TEXT) = CAST(colleges.institution AS TEXT)
     WHERE CAST(institutions.id AS TEXT) = CAST($1 AS TEXT) AND students.status = 'Pending') +
    (SELECT COUNT(*) FROM researches WHERE (researches.status = 'Pending' OR researches.status = 'Under review') AND CAST(institution AS TEXT) = CAST($1 AS TEXT)) 
    AS total_requests;
`;

// Queries for monthly statistics
const monthlyQuery = `
  SELECT 
    COUNT(*) AS total_researches,
    (SELECT 
     COUNT(*) 
     FROM supervisors
     JOIN schools ON CAST(schools.id AS TEXT) = CAST(supervisors.school AS TEXT)
     JOIN colleges ON CAST(colleges.id AS TEXT) = CAST(schools.college AS TEXT)
     JOIN institutions ON CAST(institutions.id AS TEXT) = CAST(colleges.institution AS TEXT)
     WHERE CAST(institutions.id AS TEXT) = CAST($1 AS TEXT)) AS total_supervisors,
    (SELECT 
     COUNT(*) 
     FROM students 
     JOIN departments ON CAST(departments.id AS TEXT) = CAST(students.department AS TEXT)
     JOIN schools ON CAST(schools.id AS TEXT) = CAST(departments.school AS TEXT)
     JOIN colleges ON CAST(colleges.id AS TEXT) = CAST(schools.college AS TEXT)
     JOIN institutions ON CAST(institutions.id AS TEXT) = CAST(colleges.institution AS TEXT)
     WHERE CAST(institutions.id AS TEXT) = CAST($1 AS TEXT)) AS total_students,
    (SELECT 
     COUNT(*) 
     FROM students 
     JOIN departments ON CAST(departments.id AS TEXT) = CAST(students.department AS TEXT)
     JOIN schools ON CAST(schools.id AS TEXT) = CAST(departments.school AS TEXT)
     JOIN colleges ON CAST(colleges.id AS TEXT) = CAST(schools.college AS TEXT)
     JOIN institutions ON CAST(institutions.id AS TEXT) = CAST(colleges.institution AS TEXT)
     WHERE CAST(institutions.id AS TEXT) = CAST($1 AS TEXT) AND students.status = 'Pending') +
    (SELECT COUNT(*) FROM researches WHERE (researches.status = 'Pending' OR researches.status = 'Under review') AND CAST(institution AS TEXT) = CAST($1 AS TEXT)) 
    AS total_requests
  FROM researches WHERE CAST(institution AS TEXT) = CAST($1 AS TEXT) AND EXTRACT(MONTH FROM CAST(created_at AS DATE)) = $2 AND EXTRACT(YEAR FROM CAST(created_at AS DATE)) = $3;
`;


    // Execute queries
    const totalCountsData = await client.query(totalCountsQuery, [institution_id]);
    const currentMonthData = await client.query(monthlyQuery, [institution_id, currentMonth, currentYear]);
    const lastMonthData = await client.query(monthlyQuery, [institution_id, lastMonth, lastMonthYear]);

    // Extract values
    const totals = totalCountsData.rows[0] || {};
    const current = currentMonthData.rows[0] || {};
    const previous = lastMonthData.rows[0] || {};

    // Function to calculate percentage change
    const calculatePercentage = (current: number, previous: number, total: number) => {
      if (total === 0) return 0;
      const currentPercentage = (current / total) * 100;
      const previousPercentage = (previous / total) * 100;
      return parseFloat((currentPercentage - previousPercentage).toFixed(2)) | 0.00;
    };

    // Construct response
    const analytics = {
      total_researches: totals.total_researches || 0,
      total_supervisors: totals.total_supervisors || 0,
      total_students: totals.total_students || 0,
      total_requests: totals.total_requests || 0,
      percentage_change: {
        total_researches: calculatePercentage(current.total_researches, previous.total_researches, totals.total_researches),
        total_supervisors: calculatePercentage(current.total_supervisors, previous.total_supervisors, totals.total_supervisors),
        total_students: calculatePercentage(current.total_students, previous.total_students, totals.total_students),
        total_requests: calculatePercentage(current.total_requests, previous.total_requests, totals.total_requests),
      },
    };

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error("Error retrieving analytics:", error);
    return NextResponse.json({ message: "Server error"+error }, { status: 500 });
  }
}
