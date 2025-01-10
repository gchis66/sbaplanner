import { NextResponse } from "next/server";
import { sendBusinessPlan } from "../../lib/email";
import { generatePdf, generateDocx } from "../../lib/documentGenerator";

// Use Node.js runtime instead of Edge
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { businessName, email, plan, businessStatus, logo } =
      await request.json();

    // Generate documents with logo if provided
    const logoBuffer = logo ? Buffer.from(logo.split(",")[1], "base64") : null;

    const [pdfBuffer, docxBuffer] = await Promise.all([
      generatePdf(businessName, plan, logoBuffer),
      generateDocx(businessName, plan, logoBuffer),
    ]);

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
