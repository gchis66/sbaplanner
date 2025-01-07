import { NextResponse } from "next/server";
import OpenAI from "openai";
import connectDB from "../../lib/mongodb";
import EmailRecord from "../../models/EmailRecord";
import { sendBusinessPlan } from "../../lib/email";
import { generatePdf, generateDocx } from "../../lib/documentGenerator";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://sbaplanner.vercel.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  // Always return CORS headers
  const headers = { ...corsHeaders };

  try {
    const formData = await request.formData();
    const userDataString = formData.get("userData");
    const logo = formData.get("logo");
    const userData = JSON.parse(userDataString);

    const isEstablished = userData.businessStatus === "established";

    // Create a business context based on business status
    const businessContext = isEstablished
      ? `an established business with ${userData.yearsInOperation} years of operation, current annual revenue of ${userData.currentRevenue}, and ${userData.currentEmployees} employees`
      : "a new business venture";

    // Create different section prompts based on business status
    const marketAnalysisPrompt = isEstablished
      ? `Current Market Position: ${userData.marketPosition}\nExisting Customer Base: ${userData.existingCustomerBase}\nMarket Analysis: Analysis of ${userData.targetMarket}, addressing ${userData.customerNeed}, with competition analysis: ${userData.competition}`
      : `Market Analysis: Analysis of ${userData.targetMarket}, addressing ${userData.customerNeed}, with competition analysis: ${userData.competition}`;

    const operationsPrompt = isEstablished
      ? `Current Operations: ${userData.operationalHistory}\nLocation & Facilities: ${userData.location}\nProduction/Service: ${userData.productionProcess}\nInventory & Fulfillment: ${userData.inventoryFulfillment}`
      : `Proposed Operations: Location & Facilities: ${userData.location}\nProduction/Service: ${userData.productionProcess}\nInventory & Fulfillment: ${userData.inventoryFulfillment}`;

    const financialsPrompt = isEstablished
      ? `Historical Performance: ${userData.historicalFinancials}\nFunding Requirements: ${userData.initialFunding}\nFunding Purpose: ${userData.fundingPurpose}\nProjected Timeline: ${userData.profitabilityTimeline}`
      : `Initial Funding Requirements: ${userData.initialFunding}\nProjected Timeline: ${userData.profitabilityTimeline}`;

    const prompt = `Generate a comprehensive SBA-ready business plan for ${businessContext} with the following information:

Business Overview:
Company Name: ${userData.businessName}
Description: ${userData.businessDescription}
Legal Structure: ${userData.legalStructure}
Key Personnel: ${userData.personnel}

Products & Services:
${userData.productsServices}
Unique Value Proposition: ${userData.uniqueFeatures}
${
  isEstablished
    ? `Current Market Presence: ${userData.currentMarketPresence}`
    : ""
}

${marketAnalysisPrompt}

Marketing & Sales Strategy:
Pricing Strategy: ${userData.pricingStrategy}
Sales Channels: ${userData.salesChannels}
Brand Message: ${userData.brandMessage}
Marketing Methods: ${userData.marketingMethods}
Online Presence: ${userData.onlinePresence}

${operationsPrompt}

Regulatory Compliance:
${userData.regulations}

Growth Strategy:
Short-term Goals (12 months): ${userData.shortTermGoals}
Long-term Goals (2-5 years): ${userData.longTermGoals}
Scalability Plans: ${userData.scalabilityPlans}

${financialsPrompt}

Quality Control & Feedback:
${userData.qualityFeedback}

Please generate a well-structured, professional business plan that:
1. Follows SBA guidelines and formatting requirements
2. Includes all necessary sections with appropriate headings
3. Provides detailed analysis and projections
4. ${
      isEstablished
        ? "Emphasizes growth potential and historical success"
        : "Emphasizes market opportunity and execution strategy"
    }
5. Maintains a professional and confident tone
6. Includes an executive summary at the beginning`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert business plan writer with extensive knowledge of SBA requirements and business planning best practices. Generate a well-structured plan with clear section headings and professional formatting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 4000,
    });

    const generatedPlan = completion.choices[0].message.content;

    // Convert logo to base64 if it exists
    let logoBase64 = null;
    if (logo) {
      const buffer = await logo.arrayBuffer();
      logoBase64 = Buffer.from(buffer).toString("base64");
    }

    // Generate PDF and DOCX versions
    const [pdfBuffer, docxBuffer] = await Promise.all([
      generatePdf(userData.businessName, generatedPlan, logoBase64),
      generateDocx(userData.businessName, generatedPlan, logoBase64),
    ]);

    // Connect to MongoDB
    await connectDB();

    // Store the record in MongoDB
    await EmailRecord.create({
      businessName: userData.businessName,
      recipientEmail: userData.email,
      businessStatus: userData.businessStatus,
      planContent: generatedPlan,
    });

    // Send email with both formats
    try {
      await sendBusinessPlan(
        userData.email,
        userData.businessName,
        pdfBuffer,
        docxBuffer
      );

      return NextResponse.json(
        {
          plan: generatedPlan,
          emailSent: true,
        },
        {
          status: 200,
          headers,
        }
      );
    } catch (error) {
      console.error("Error sending email:", error);
      // Still return the plan but indicate email failure
      return NextResponse.json(
        {
          plan: generatedPlan,
          emailSent: false,
          emailError:
            "Failed to send email. Please try again or contact support.",
        },
        {
          status: 200,
          headers,
        }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate business plan",
      },
      {
        status: 500,
        headers,
      }
    );
  }
}
