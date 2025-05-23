# SBA Planner - AI-Powered Business Plan Generator

> Generate SBA-ready business plans in under 20 minutes using AI

**Live Demo:** [www.sbaplanner.com](https://www.sbaplanner.com)

## 🚀 Overview

SBA Planner is an AI-powered web application that helps entrepreneurs and small business owners create professional, SBA-compliant business plans quickly and efficiently. Instead of spending weeks writing a business plan from scratch, users can generate comprehensive, customized plans in just 15-20 minutes.

### ✨ Key Features

- **🤖 AI-Powered Generation**: Uses OpenAI GPT-4 to create professional business plans
- **📋 Guided Form Process**: 15-minute guided questionnaire with clear prompts
- **📄 Multiple Export Formats**: Download plans in PDF, Word (.docx), and plain text
- **✅ SBA Compliance**: All plans follow strict SBA formatting requirements
- **📊 Financial Projections**: Automated financial forecasts and projections
- **🏭 Industry-Specific**: Tailored templates for different industries and business types
- **📧 Email Delivery**: Plans delivered instantly via email
- **💼 Professional UI**: Modern, responsive design with excellent UX

## 🏗️ Technical Stack

- **Frontend**: Next.js 15.1.1 with App Router, React 19
- **Styling**: Tailwind CSS 3.4.1
- **AI Integration**: OpenAI GPT-4 API
- **Document Generation**:
  - jsPDF for PDF generation
  - docx library for Word documents
- **Email**: Nodemailer for plan delivery
- **Deployment**: Vercel-optimized build configuration

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sbaplanner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   # Email configuration (for nodemailer)
   EMAIL_HOST=your_smtp_host
   EMAIL_PORT=587
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

### For Users:

1. **Fill Out Form**: Complete a guided 15-minute questionnaire about your business
2. **AI Generation**: Our AI analyzes your responses and generates a professional plan
3. **Receive Plan**: Get your customized business plan delivered via email in multiple formats
4. **Customize**: Edit and modify the plan using the provided Word document

### Business Plan Sections Generated:

- **Executive Summary**: Business overview, vision, and key highlights
- **Company Description**: Business model, structure, and operations
- **Market Analysis**: Industry trends, target market, and competition
- **Product/Service Line**: Detailed offerings and competitive advantages
- **Marketing & Sales**: Strategy, pricing, and customer acquisition
- **Operations**: Day-to-day operations and processes
- **Financial Projections**: 3-year forecasts, cash flow, and break-even analysis
- **Risk Analysis**: Risk assessment and mitigation strategies

## 🚀 API Endpoints

### `POST /api/generatePlan`

Generates a business plan using OpenAI GPT-4

- **Input**: Form data from business plan questionnaire
- **Output**: Streaming response with generated business plan content
- **Features**: Edge runtime, 5-minute timeout, CORS enabled

### `POST /api/sendDocuments`

Processes and emails the generated business plan

- **Input**: Business plan content and user email
- **Output**: Multiple format documents (PDF, DOCX, TXT) sent via email

## 🏢 Business Model

### Target Audience

- **Primary**: Entrepreneurs seeking SBA loans and funding
- **Secondary**: Small business owners expanding operations
- **Tertiary**: Business consultants and advisors

### Value Proposition

- **Time Savings**: 20 minutes vs. 10+ hours traditional planning
- **Professional Quality**: AI ensures comprehensive, well-structured plans
- **SBA Compliance**: Meets all Small Business Administration requirements
- **Cost Effective**: Affordable alternative to hiring business consultants

## 🔗 Integrations

- **Funding Resources**: Integration with Southend Capital for SBA loan assistance
- **AI Platform**: OpenAI GPT-4 for intelligent content generation
- **Email Service**: Automated delivery system for completed plans

## 📊 Performance Features

- **Edge Runtime**: Fast API responses with global distribution
- **Streaming**: Real-time plan generation with progress updates
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **SEO Optimized**: Meta tags and structured data for search engines

## 🛡️ Security & Privacy

- **Data Protection**: Bank-level encryption for user data
- **Privacy First**: Automatic data deletion after plan generation
- **Secure Processing**: Isolated AI processing on secure servers
- **No Data Sharing**: User information never shared with third parties

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── BusinessPlanForm.js    # Main form component
│   │   ├── Logo.js                # Company branding
│   │   └── Header.js              # Navigation component
│   ├── api/
│   │   ├── generatePlan/          # AI business plan generation
│   │   └── sendDocuments/         # Document processing and email
│   ├── funding/                   # Funding resources integration
│   ├── page.js                    # Main landing page
│   ├── layout.js                  # App layout and metadata
│   └── globals.css                # Global styles
└── public/                        # Static assets
```

## 🚀 Deployment

The app is optimized for Vercel deployment with:

- **Static file handling**: Automated public asset copying
- **API routes**: Edge functions for optimal performance
- **Build optimization**: Standalone build configuration

```bash
npm run build
npm start
```

## 📄 License

This project is private and proprietary. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.

## 📞 Support

For technical support or business inquiries:

- **Website**: [www.sbaplanner.com](https://www.sbaplanner.com)
- **Email**: Contact form available on website

---

**Built with ❤️ for entrepreneurs and small business owners seeking SBA funding**
