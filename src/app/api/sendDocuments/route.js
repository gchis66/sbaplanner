import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import EmailRecord from "../../models/EmailRecord";
import { sendBusinessPlan } from "../../lib/email";
import { generatePdf, generateDocx } from "../../lib/documentGenerator";

// Use Node.js runtime instead of Edge
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { businessName, email, plan } = await request.json();

    // Generate documents
    const [pdfBuffer, docxBuffer] = await Promise.all([
      generatePdf(businessName, plan),
      generateDocx(businessName, plan),
    ]);

    // Connect to MongoDB and store the record
    await connectDB();
    await EmailRecord.create({
      businessName,
      recipientEmail: email,
      planContent: plan,
    });

    // Send email with attachments
    await sendBusinessPlan(email, businessName, pdfBuffer, docxBuffer);

    return NextResponse.json({
      success: true,
      message: "Documents sent successfully",
    });
  } catch (error) {
    console.error("Error sending documents:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send documents",
      },
      {
        status: 500,
      }
    );
  }
}
