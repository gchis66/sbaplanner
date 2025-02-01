import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";
export const maxDuration = 600;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
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

// System prompts and guidelines
const systemPrompt = `You are an expert business consultant specializing in preparing SBA-ready business plans and financial projections. Your expertise includes market analysis, financial modeling, competitive analysis, and strategic planning. Approach each business plan with attention to detail, realistic projections, and actionable strategies. Use specific industry knowledge and current market trends to enhance the plans.

Key Responsibilities:
- Create comprehensive, actionable business plans
- Develop realistic financial projections
- Analyze market conditions and competition
- Identify key success metrics and milestones
- Provide detailed implementation strategies
- Assess and address potential risks`;

const exampleContext = `The following examples demonstrate successful business plans. Pay attention to their structure, depth of analysis, and professional tone. When creating new plans:
- Maintain consistent level of detail while adapting to specific industry
- Follow similar section organization but customize content
- Use similar depth of financial analysis
- Mirror the professional language and presentation
- Adapt market analysis to current conditions`;

const examples = `
EXAMPLE BUSINESS PLAN 1:
Wooden Grain Toy Company
Business Plan

Andrew Robertson, Owner
Created on December 29, 2016

Executive Summary
Product
Wooden Grain Toys manufactures high-quality toys for children aged 3-10. All toys are made from solid hardwoods including maple, beech, birch, cherry, and oak. The toys are built to be long lasting with sufficient moving parts to engage each child's interest, but not limit his or her imagination. 
Customers
The target audience for Wooden Grain Toys is adults, specifically parents and grandparents who wish to give their children or grandchildren the opportunity to play with a toy that is not only durable and aesthetically pleasing, but also foster the child's creativity.
Future of the Company
Although the toy manufacturing business is highly competitive, we believe that there is a place for high-quality, attractive, durable, and affordable toys. Our goal is to build and market toys that will entertain children and stand the test of time.

Company Description
Mission Statement
To build and sell high-quality toys that will be cherished and handed down from generation to generation.
Principal Members
Andrew Robertson — owner, designer and primary builder
Jane Robertson — business manager/bookkeeper
Bill Williams and Houlin Lee — builders, assemblers, and painters
Mickey Soukarin — web master and handles shipping for web, mail, and special orders
Legal Structure
Wooden Grain Toys is a sole proprietorship.
Market Research
Industry
Built-Rite Toys will be a part of the toy manufacturing industry. Currently, wooden toys are considered a niche market, comprised of different sized companies. The largest companies, such as Plastique Toys and Metal Happy Toys, have large inventories of products that are offered internationally. The smallest companies sell locally either in shops, at craft fairs, or online.
This industry is currently suffering from the economic recession as consumers are spending less on non-essentials. However, industry revenues increased by $1.2 million in the 2nd quarter of 2012. This means there is a potential for growth as the economy recovers.
Detailed Description of Customers
The two groups that the company plans to market to are parents (age 18-30) of young children and grandparents (age 60-75) of young children with an income range of $35,000 - $80,000 a year. Our target customers are interested in giving durable, well-made toys to their children and grandchildren to help foster creativity. They value quality and they research the products they buy. Our target customers are willing to spend more money on products that are of higher quality and last longer.
Company Advantages
Wooden Grain Toys has the following advantages compared to competitors:
Basic, practical designs.
Safe, non-toxic paints, parts, and accessories.
Easy-to-assemble parts.
All components are manufactured in America and made with grade-A wood, high quality steel, and rubber.
Quick, 48-hour delivery since our goal is to keep at least 50 units of each toy in stock.
High-quality, interactive website.
Face-to-face interaction with customers at craft shows over a three state area.
Regulations
Wooden Grain Toys must meet all federal and state regulations concerning toy manufacturing. Specifically, Code of Federal Regulations in Title 42, Parts 1234 and 9876.50, 51, 52 and 89 C.F.R. 5555.18(a)(9); Consumer Product Safety Improvement Act of 2008; Lead-Free Toys Act; and Title 99.9 of the Code of Oregon.

Service Line
Product/Service
Wooden Grain Toys will sell wooden toys made from solid hardwoods (maple, beech, birch, cherry, and oak) and steel rivets. The toys are handcrafted and designed for small children to easily use. Our line currently includes the following nine models:
All-Purpose Pick-Up Truck w/movable doors and tailgate
Dump Truck w/functioning dumping mechanism and box
Biplane (two-seater) w/movable propeller
Steam engine with coal tender - additional cars available separately:
Caboose, flat car w/logs, box car, tank car, coal car
City Bus
Tow Truck
Flat-Bed Truck w/logs
Sports Car
Sedan
Pricing Structure
Wooden Grain Toys will offer its products for the following prices:
All-Purpose Pick-Up Truck w/movable doors and tailgate - $25
Dump Truck w/functioning dumping mechanism and box - $30
Biplane (two-seater) w/movable propeller - $20
Additional train cars (single car) - $5
Additional train cars (three cars) - $12
City Bus - $12
Tow Truck - $18
Flat-Bed Truck w/logs - $35
Sports Car - $20
Sedan - $20
Product Lifecycle
All current Wooden Grain Toys products are in production and inventory is being accumulated.
Intellectual Property Rights
Wooden Grain Toys is a trademarked name in the State of Oregon.
Research and Development
The company is planning to conduct the following research and development:
Include a feedback mechanism on the website for ideas, suggestions, and improvements
Provide comment cards for distribution at craft fairs
Review available market research to identify top children's toys and reason(s) for their popularity
Marketing & Sales
Growth Strategy
To grow the company, Wooden Grain Toys will do the following:
Sell products at craft fairs in California, Oregon, and Washington.
As business grows, advertise in target markets, especially in advance of the holiday season.
Communicate with the Customer
Wooden Grain Toys will communicate with its customers by:
Providing an email newsletter with company news, product information, and craft fair schedule.
Using targeted Google and Facebook advertisements.
Utilizing social media such as Twitter, YouTube, Facebook, LinkedIn, Pintrest and Tumblr.
Providing contact information on the company website.
Adding labels on toys that include company name, contact info, and web address.
How to Sell
Currently, the only person in charge of sales for Wooden Grain Toys is the owner, Andrew Robertson. As profits increase, Wooden Grain Toys will look to add an employee to assist with social media and online marketing. The target demographic for the company will be parents of children aged 3-10. The company will increase awareness to our targeted customers through online advertising and attending craft fairs. 


`;

const evaluationGuidelines = `When creating business plans, ensure:

FINANCIAL PROJECTIONS
- All projections are realistic and well-justified
- Include detailed assumptions behind numbers
- Provide monthly projections for year 1
- Include quarterly projections for years 2-3
- Show clear break-even analysis

MARKET ANALYSIS
- Include current industry trends and data
- Provide specific market size figures
- Detail target market segments
- Analyze direct and indirect competition
- Include market penetration strategy

OPERATIONAL DETAILS
- Specific implementation timelines
- Detailed resource requirements
- Clear organizational structure
- Quality control processes
- Supply chain management

RISK MANAGEMENT
- Identify key business risks
- Provide mitigation strategies
- Include contingency plans
- Address market uncertainties
- Consider regulatory compliance

METRICS & MILESTONES
- Define specific success metrics
- Set clear milestone dates
- Include progress tracking methods
- Establish review periods
- Detail growth indicators`;

// Function to get relevant example based on business type
function getRelevantExample(businessType) {
  if (businessType === "service" || businessType === "consulting") {
    return examples.split("EXAMPLE BUSINESS PLAN 2:")[1]; // Get consulting example
  }
  return examples.split("EXAMPLE BUSINESS PLAN 2:")[0]; // Get product example
}

export async function POST(request) {
  const headers = {
    ...corsHeaders,
    "Content-Type": "application/json",
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 550000); // Set timeout just under Vercel's limit

  try {
    const formData = await request.formData().catch((e) => {
      throw new Error(`Failed to parse form data: ${e.message}`);
    });

    const userDataString = formData.get("userData");
    if (!userDataString) {
      throw new Error("No userData found in form data");
    }

    let userData;
    try {
      userData = JSON.parse(userDataString);
    } catch (e) {
      throw new Error(`Failed to parse userData JSON: ${e.message}`);
    }

    if (!userData.businessStatus) {
      throw new Error("Business status is required");
    }

    // Validate required fields for established businesses
    if (userData.businessStatus === "established") {
      const requiredFields = [
        "yearsInOperation",
        "currentRevenue",
        "currentEmployees",
        "currentMarketPresence",
        "marketPosition",
        "existingCustomerBase",
        "operationalHistory",
        "historicalFinancials",
      ];

      const missingFields = requiredFields.filter(
        (field) => !userData[field]?.trim()
      );
      if (missingFields.length > 0) {
        throw new Error(
          `Missing required fields for established business: ${missingFields.join(
            ", "
          )}`
        );
      }
    }

    // Verify OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    // Create a TransformStream for streaming the response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    try {
      // Start the OpenAI stream with full context
      const completion = await openai.chat.completions.create(
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "system",
              content: exampleContext,
            },
            {
              role: "system",
              content: evaluationGuidelines,
            },
            {
              role: "system",
              content: examples,
            },
            {
              role: "user",
              content: generateEnhancedPrompt(userData),
            },
          ],
          stream: true,
          temperature: 0.5,
          max_tokens: 4000,
        },
        {
          signal: controller.signal, // Add abort signal
        }
      );

      let totalContent = "";

      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          totalContent += content;
          await writer.write(encoder.encode(content));
        }
      }

      if (totalContent.length === 0) {
        throw new Error("No content generated from OpenAI");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        await writer.write(
          encoder.encode(
            JSON.stringify({
              error: "Request timeout",
              details:
                "The request took too long to process. Please try again. If this persists, try breaking your submission into smaller sections.",
            })
          )
        );
      } else {
        await writer.write(
          encoder.encode(
            JSON.stringify({
              error: "Error generating business plan",
              details: error.message,
            })
          )
        );
      }
    } finally {
      clearTimeout(timeoutId);
      await writer.close();
    }

    return new Response(stream.readable, { headers });
  } catch (error) {
    clearTimeout(timeoutId);
    return new Response(
      JSON.stringify({
        error: "Error generating business plan",
        details: error.message,
        type: error.constructor.name,
      }),
      {
        status: 500,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

function generateEnhancedPrompt(userData) {
  const isEstablished = userData.businessStatus === "established";

  return `
Based on the provided business information, create a comprehensive SBA-ready business plan that includes:

 EXECUTIVE SUMMARY
- Business overview and vision
- Value proposition
- Key success factors
- Financial highlights and projections
- Implementation timeline
- Management team qualifications
- Funding requirements and use of funds

 COMPANY DESCRIPTION
- Detailed business model
- Organizational structure
- Core competencies
- Company culture and values
- Legal structure and ownership
- Business location and facilities
- Operating hours and seasons
- Insurance and liability management

 MARKET ANALYSIS
- Industry overview and trends
- Total market size and growth potential
- Target market segmentation and size
- Customer demographics and psychographics
- Competitive landscape analysis
- Direct and indirect competitors
- SWOT analysis
- Market share projections
- Entry barriers and regulations
- Industry success factors

 PRODUCT/SERVICE LINE
- Detailed product/service descriptions
- Features and benefits
- Competitive advantages
- Development status
- Intellectual property status
- R&D activities
- Future product/service roadmap
- Production process
- Quality control measures
- Suppliers and vendors
- Cost structure

 MARKETING AND SALES STRATEGY
- Positioning strategy
- Pricing strategy and model
- Distribution channels
- Sales process and cycle
- Customer acquisition strategy
- Marketing channels and tactics
- Marketing budget allocation
- Customer retention strategies
- Partnership opportunities
- Brand development
- Digital presence strategy

 OPERATIONAL PLAN
- Day-to-day operations
- Production/service delivery process
- Facility requirements and layout
- Equipment and technology needs
- Supply chain management
- Inventory management
- Quality control procedures
- Customer service approach
- Key partnerships and relationships
- Staffing and training plans

 FINANCIAL PROJECTIONS
- Startup costs breakdown
- 3-year financial forecasts
- Monthly cash flow projections
- Break-even analysis
- Income statements
- Balance sheets
- Key financial metrics
- Funding requirements
- Use of funds
- Exit strategy

 RISK ANALYSIS
- Market risks
- Operational risks
- Financial risks
- Competitive risks
- Regulatory risks
- Technology risks
- Mitigation strategies
- Contingency plans
- Insurance coverage
- Emergency procedures

Business Details:
Business Name: ${userData.businessName || "N/A"}
Business Description: ${userData.businessDescription || "N/A"}
Principal Members & Roles: ${userData.personnel || "N/A"}
Legal Structure: ${userData.legalStructure || "N/A"}
Products/Services: ${userData.productsServices || "N/A"}
Unique Features: ${userData.uniqueFeatures || "N/A"}
Target Market: ${userData.targetMarket || "N/A"}
Customer Need: ${userData.customerNeed || "N/A"}
Competition: ${userData.competition || "N/A"}
Pricing Strategy: ${userData.pricingStrategy || "N/A"}
Sales Channels: ${userData.salesChannels || "N/A"}
Location & Facilities: ${userData.location || "N/A"}
Production Process: ${userData.productionProcess || "N/A"}
Inventory & Fulfillment: ${userData.inventoryFulfillment || "N/A"}
Brand Message: ${userData.brandMessage || "N/A"}
Marketing Methods: ${userData.marketingMethods || "N/A"}
Online Presence: ${userData.onlinePresence || "N/A"}
Regulations: ${userData.regulations || "N/A"}
Short-Term Goals: ${userData.shortTermGoals || "N/A"}
Long-Term Goals: ${userData.longTermGoals || "N/A"}
Scalability & Expansion: ${userData.scalabilityPlans || "N/A"}
Initial Funding: ${userData.initialFunding || "N/A"}
Profitability Timeline: ${userData.profitabilityTimeline || "N/A"}
Quality Assurance & Feedback: ${userData.qualityFeedback || "N/A"}

Additional Requirements:
- Use current industry benchmarks and metrics
- Provide detailed implementation timelines
- Include specific, measurable goals
- Address potential challenges and solutions
- Include contingency plans
- Ensure all projections are realistic and well-supported
- Include relevant industry regulations and compliance requirements
- Detail specific marketing and sales strategies
- Outline clear operational procedures
- Provide specific financial assumptions
- Write in flowing paragraphs rather than fragmenting your ideas. Instead of treating each section like an isolated bullet point, let your thoughts connect naturally. When you start a new section, use the header to introduce the topic, then expand on it in complete, well-developed paragraphs that build on each other.
- Think of section headers as chapter titles in a book - they introduce the theme, but the real substance comes in the paragraphs that follow. Your goal is to tell a coherent story, not just list facts.
- Avoid writing that feels mechanical`;
}
