import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";
export const maxDuration = 300;

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
Wooden Grain Toys manufactures high-quality toys for children aged 3-10. All toys are made from solid hardwoods including maple, beech, birch, cherry, and oak. The toys are built to be long lasting with sufficient moving parts to engage each child’s interest, but not limit his or her imagination. 
Customers
The target audience for Wooden Grain Toys is adults, specifically parents and grandparents who wish to give their children or grandchildren the opportunity to play with a toy that is not only durable and aesthetically pleasing, but also foster the child’s creativity.
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
Review available market research to identify top children’s toys and reason(s) for their popularity
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

EXAMPLE BUSINESS PLAN 2:
We Can Do It Consulting
Business Plan

Rebecca Champ, Owner
Created on December 29, 2016

Executive Summary
Product
We Can Do It Consulting provides consultation services to small- and medium-sized companies. Our services include office management and business process reengineering to improve efficiency and reduce administrative costs.
Customers
The target audience for We Can Do It Consulting is business owners, human resources directors, program managers, presidents, or CEOs with 5 to 500 employees who want to increase productivity and reduce overhead costs. Specifically, we specialize in consulting white collar executives on office processes such as job tracking, production, getting the most out of meetings, leadership, financial or hiring best practices, and other needs relevant to potential customers who serve in a management role within small or large organizations that may be bogged down by processes, bureaucracy, or technical experts with little leadership experience.
Future of the Company
Consulting is a fast-paced, evolving industry. In response to this climate, We Can Do It Consulting will offer other services, including facilitation and requirements analysis in the future.

Company Description
Mission Statement
To provide quality services to our clients that will help their companies prosper and grow.
Principal Members
Rebecca Champ — owner, primary consultant
Guy Champ — business manager/sales
Sophie Roberts — account manager
Legal Structure
We Can Do It Consulting is an S Corporation, incorporated in Greenville, South Carolina.

Market Research
Industry
We Can Do It Consulting will join the office management and business process improvement consulting industry. Generally, larger consulting firms, such as KEG Consulting, work with international corporations while smaller consulting firms work with both large corporations and smaller organizations, usually closer to home. Consulting firms structured like ours also have a history of working with local, state, and federal government agencies. The consulting industry is still recovering from the economic recession. It was hit hardest in 2009 when the industry shrank by 9.1%. However, as the economy recovers, the industry is showing signs of growth. A recent study stated that operations management consulting is projected to grow by 5.1% per year for the next several years.
Detailed Description of Customers
The target customers for We Can Do It Consulting are business owners, human resources directors, program managers, presidents or CEOs with 5 to 500 employees who want to increase productivity and reduce overhead costs. Specifically, we specialize in consulting white collar executives on office processes such as job tracking, production, getting the most out of meetings, leadership, financial or hiring best practices, and other needs relevant to potential customers who serve in a management role within small or large organizations that may be bogged down by processes, bureaucracy, or technical experts with little leadership experience. To capitalize on opportunities that are geographically close as we start and grow our business, We Can Do It Consulting will specifically target executives within companies in the manufacturing, automotive, healthcare, and defense industries. This will allow us to take advantage of the company’s close proximity to hospitals (one of the largest employers in the region), automobile and vehicle parts factories, and government contractors supporting the nearby former Air Force base, now an aviation technology center.
Company Advantages
Because We Can Do It Consulting provides services, as opposed to a product, our advantages are only as strong as our consultants. Aside from ensuring our team is flexible, fast, can provide expert advice and can work on short deadlines, we will take the following steps to support consulting services:
Maintain only PMP-certified project managers
Ensure account team members use our proprietary planning and reporting process to stay in touch with customers and keep them updated on projects
Provide public speaking training for all consultants
Develop close relationships with subcontractors who can support us in areas such as graphic design, to ensure materials and presentations are always clear and maintain a consistent brand
All our staff members have at least a four-year degree, with 20% having an advanced degree
We are a virtual company without a lot of overhead costs or strict corporate rules, which saves time, money and creates a flexible workplace for getting things done
Regulations
We Can Do It Consulting must meet all Federal and state regulations concerning business consulting. Specifically, Code of Federal Regulations in Title 64, Parts 8753 and 4689.62, 65, and 74 and Title 86.7 of the Code of South Carolina.

Service Line
Product/Service
Services Include:
Business Process Reengineering Analysis
Office Management Analysis
On-Site Office Management Services
Business Process Reengineering Facilitation
Analytics
Change Management
Customer Relationship Management
Financial Performance
Operations Improvement
Risk Management
Pricing Structure
We Can Do It Consulting will offer its services at an hourly rate using the following labor categories and rates:
Principal, $150
Account Executive, $140
Project Manager, $135
Project Coordinator, $100
Business Analyst, $90
Process Analyst, $90
Financial Analyst, $85
Technologist, $75
Product Lifecycle
All services are ready to be offered to clients, pending approval of contracts.
Intellectual Property Rights
We Can Do It Consulting is a trademarked name in the state of South Carolina, and we have filed for protection of our proprietary processes and other intellectual property, such as our logo. We have also registered our domain name and parked relevant social media accounts for future use and to prevent the likelihood of someone impersonating one of our consultants.
Research and Development
The company is planning to conduct the following research and development:
Create a custom technology solution for manufacturers of vehicles such as automobiles or airplanes that helps better track each manufactured piece and its status in the assembly process
Determine the need for additional consulting services within our market related to tying improved processes to opportunities for increased sales and promotion to potential customers
Find trends in software solutions that may provide potentially competitive automated services in order to ensure We Can Do It Consulting continues to carefully carve its niche in the marketplace

Marketing & Sales
Growth Strategy
To grow the company, We Can Do It Consulting will do the following:
Network at manufacturing, automobile industry, and healthcare conferences
Establish a company website that contains engaging multimedia content about our services
As the business grows, advertise in publications that reach our target industries
Communicate with the Customer
We Can Do It Consulting will communicate with its customers by:
Meeting with local managers within targeted companies
Using social media such as Twitter, YouTube, Facebook, and LinkedIn
Providing contact information on the company website
How to Sell
Currently, the only person in charge of sales for We Can Do It Consulting is the business manager, Guy Champ. As profits increase, We Can Do It will look to add an employee to assist with account management/coordination. This individual will also provide company social media and online marketing support. The company will increase awareness to our targeted customers through online advertising, proactive public relations campaigns, and attending tradeshows.

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

export async function POST(request) {
  const headers = {
    ...corsHeaders,
    "Content-Type": "text/plain; charset=utf-8",
  };

  try {
    const formData = await request.formData();
    const userDataString = formData.get("userData");
    const userData = JSON.parse(userDataString);

    // Create a TransformStream for streaming the response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Start the OpenAI stream
    const completion = await openai.chat.completions.create({
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
    });

    let currentSection = "";
    let sectionContent = "";
    const sections = [
      "EXECUTIVE SUMMARY",
      "COMPANY DESCRIPTION",
      "MARKET ANALYSIS",
      "PRODUCT/SERVICE LINE",
      "MARKETING & SALES",
      "OPERATIONS",
      "FINANCIAL PROJECTIONS",
      "RISK ANALYSIS",
    ];

    // Process the stream
    (async () => {
      try {
        // Write initial content type for streaming
        await writer.write(encoder.encode(""));

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            // Check if we're starting a new section
            const matchedSection = sections.find((section) =>
              content.includes(section)
            );
            if (matchedSection) {
              // If we have content from previous section, write it with proper formatting
              if (currentSection && sectionContent) {
                await writer.write(
                  encoder.encode(`\n\n${currentSection}\n${sectionContent}\n`)
                );
                sectionContent = "";
              }
              currentSection = matchedSection;
            } else {
              // Append content to current section
              sectionContent += content;
            }

            // Write the content directly to maintain streaming
            await writer.write(encoder.encode(content));
          }
        }

        // Write any remaining content
        if (currentSection && sectionContent) {
          await writer.write(encoder.encode(`\n${sectionContent}`));
        }
      } catch (error) {
        console.error("Streaming error:", error);
        await writer.write(
          encoder.encode(
            "\n\nError generating business plan. Please try again."
          )
        );
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, { headers });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Error generating business plan: " + error.message, {
      status: 500,
      headers,
    });
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
- Provide specific financial assumptions`;
}
