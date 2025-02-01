import { NextResponse } from "next/server";
import { sendBusinessPlan } from "../../lib/email";
import { generatePdf, generateDocx } from "../../lib/documentGenerator";

// Use Node.js runtime instead of Edge
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { businessName, email, plan, businessStatus, logo, date } =
      await request.json();

    // Log received data
    console.log("Received document generation request:", {
      businessName,
      email,
      planLength: plan?.length,
      businessStatus,
      hasLogo: !!logo,
      date,
    });

    // Generate documents with logo if provided
    const logoBase64 = logo || null; // Pass the base64 string directly

    console.log("Starting document generation...");

    try {
      const [pdfBuffer, docxBuffer] = await Promise.all([
        generatePdf(businessName, plan, logoBase64, date).catch((error) => {
          console.error("PDF generation failed:", {
            error: error.message,
            stack: error.stack,
          });
          throw new Error(`PDF generation failed: ${error.message}`);
        }),
        generateDocx(businessName, plan, logoBase64, date).catch((error) => {
          console.error("DOCX generation failed:", {
            error: error.message,
            stack: error.stack,
          });
          throw new Error(`DOCX generation failed: ${error.message}`);
        }),
      ]);

      console.log("Documents generated successfully", {
        pdfSize: pdfBuffer?.length,
        docxSize: docxBuffer?.length,
      });

      // Send email with attachments
      console.log("Attempting to send email...");
      await sendBusinessPlan(email, businessName, pdfBuffer, docxBuffer);
      console.log("Email sent successfully");

      return NextResponse.json({
        success: true,
        message: "Documents sent successfully",
      });
    } catch (error) {
      console.error("Document generation or email sending failed:", {
        error: error.message,
        stack: error.stack,
        phase: error.message.includes("PDF")
          ? "PDF Generation"
          : error.message.includes("DOCX")
          ? "DOCX Generation"
          : "Email Sending",
      });
      throw error; // Re-throw to be caught by outer try-catch
    }
  } catch (error) {
    console.error("Fatal error in document processing:", {
      error: error.message,
      stack: error.stack,
      type: error.constructor.name,
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send documents",
        type: error.constructor.name,
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
