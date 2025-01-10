import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendBusinessPlan(
  recipientEmail,
  businessName,
  pdfBuffer,
  docxBuffer
) {
  const emailContent = `
Dear Business Owner,

Thank you for using SBA Planner! Your business plan has been generated and is attached in both PDF and Word formats for your convenience.

The PDF version is ideal for immediate viewing and sharing, while the Word document allows you to make any necessary edits or customizations.

Best regards,
SBA Planner Team
  `;

  const sanitizedBusinessName = businessName
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();

  try {
    // Convert ArrayBuffer to Buffer if needed
    const pdfContent =
      pdfBuffer instanceof ArrayBuffer ? Buffer.from(pdfBuffer) : pdfBuffer;
    const docxContent =
      docxBuffer instanceof ArrayBuffer ? Buffer.from(docxBuffer) : docxBuffer;

    await transporter.sendMail({
      from: '"SBA Planner" <delivery@sbaplanner.com>',
      to: recipientEmail,
      subject: `Your Business Plan for ${businessName}`,
      text: emailContent,
      attachments: [
        {
          filename: `${sanitizedBusinessName}_sba_business_plan.pdf`,
          content: pdfContent,
          contentType: "application/pdf",
        },
        {
          filename: `${sanitizedBusinessName}_sba_business_plan.docx`,
          content: docxContent,
          contentType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
      ],
    });
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error; // Propagate the error for better error handling
  }
}
