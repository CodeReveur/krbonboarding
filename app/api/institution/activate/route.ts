
import { NextRequest, NextResponse } from 'next/server';
import client from "../../utils/db"; // Adjust the path to your database client

export async function PUT(req: NextRequest): Promise<NextResponse> {
    let requestBody;
      
      // Safe JSON parsing
      try {
          requestBody = await req.json();
      } catch (error) {
          return NextResponse.json({ message: "Invalid JSON format in request." }, { status: 400 });
      }
      const {id} = requestBody;
      
      if (!id) {
          return NextResponse.json({ message: "Research ID is required." }, { status: 400 });
      }

    try {
      let query = `UPDATE institutions SET payment_status = 'Maintained' WHERE id = $1 RETURNING id`;
      let query2 = `UPDATE institutions SET status = 'Active' WHERE id = $1 RETURNING id`;
   
        //Update payments
        const researchResult = await client.query(query, [id]);

        //activate 
        await client.query(query2, [id]);


        if (!researchResult) {
            return NextResponse.json({ message: "Research not found." }, { status: 404 });
        }

        return NextResponse.json("successfully!", { status: 200 });
    } catch (error) {
        console.error("Error retrieving research:", error);
        return NextResponse.json({ message: "Error retrieving Research", error: (error as Error).message }, { status: 500 });
    }
}
