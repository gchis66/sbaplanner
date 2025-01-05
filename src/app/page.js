"use client";

import { useState } from "react";
import BusinessPlanForm from "./components/BusinessPlanForm";
import Logo from "./components/Logo";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs = [
    {
      question: "How long does it take to generate a business plan?",
      answer:
        "The entire process takes just 15-20 minutes: 10-15 minutes to answer simple questions, and 2-3 minutes for our AI to generate your customized plan. Compare this to the typical 10+ hours needed to write a business plan from scratch.",
    },
    {
      question: "What information do I need to have ready?",
      answer:
        "You'll need basic information about your business including your business concept, target market, financial projections, and operational details. Our form guides you through each section, so you don't need to prepare anything in advance.",
    },
    {
      question: "How does the AI writing assistant work?",
      answer:
        "Our AI analyzes your form responses and combines them with industry best practices and SBA requirements to generate professional, coherent business plans. It ensures all critical sections are included and properly formatted.",
    },
    {
      question: "What format will I receive my business plan in?",
      answer:
        "Your plan will be delivered in multiple formats including PDF, Microsoft Word (.docx), and plain text. This allows you to easily make edits or format changes as needed using your preferred software.",
    },
    {
      question: "Are the financial projections accurate for my industry?",
      answer:
        "Our financial projections are based on your inputs combined with industry standards and market data. While they provide a solid starting point, we recommend reviewing and adjusting them with your accountant or financial advisor.",
    },
    {
      question: "Can I update my business plan after it's generated?",
      answer:
        "Yes, you'll receive editable versions of your plan that you can modify using standard word processing software. You can also regenerate your plan with updated information through our platform at any time.",
    },
    {
      question: "Is my business information secure?",
      answer:
        "Yes, we use bank-level encryption to protect your data. Your information is never shared with third parties, and our AI processing is done on secure, isolated servers. We automatically delete your data after plan generation for added security.",
    },
  ];

  const LandingContent = () => (
    <>
      {/* Navigation */}
      <div className="absolute top-0 left-0 w-full p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo className="text-white" />
          <div className="flex gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-white hover:text-gray-200 transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-white hover:text-gray-200 transition-colors font-medium"
            >
              FAQ
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 min-h-[80vh] flex flex-col items-center justify-center text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            Generate SBA-ready business plans in under 20 minutes
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Skip the complexity and fast-track your funding with our AI platform
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Get Started Now
          </button>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            3 Step Process
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Input Information</h3>
              <p className="text-gray-600">
                Answer simple questions about your business - takes just 15
                minutes
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Receive Your Plan</h3>
              <p className="text-gray-600">
                Receive your professionally formatted plan instantly by email
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customize & Edit</h3>
              <p className="text-gray-600">
                Make optional adjustments to perfectly match your needs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-4 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* AI-Powered Writing */}
            <div className="p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 text-blue-600 mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                AI-Powered Writing Assistant
              </h3>
              <p className="text-gray-600">
                Instantly transforms your simple inputs into professional
                business plans
              </p>
            </div>

            {/* SBA Compliance */}
            <div className="p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 text-blue-600 mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                SBA Guidelines Compliance
              </h3>
              <p className="text-gray-600">
                Every plan follows strict SBA formatting requirements and
                includes all necessary sections
              </p>
            </div>

            {/* Guided Form Process */}
            <div className="p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 text-blue-600 mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Guided Form Process
              </h3>
              <p className="text-gray-600">
                15-minute guided process with clear prompts and progress
                tracking
              </p>
            </div>

            {/* Multiple Formats */}
            <div className="p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 text-blue-600 mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Multiple Export Formats
              </h3>
              <p className="text-gray-600">
                Download your plan in various formats including PDF, Word, and
                plain text for easy editing
              </p>
            </div>

            {/* Industry Specific */}
            <div className="p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 text-blue-600 mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Industry-Specific Templates
              </h3>
              <p className="text-gray-600">
                Tailored business plan templates for different industries and
                business types
              </p>
            </div>

            {/* Financial Projections */}
            <div className="p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 text-blue-600 mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Financial Projections
              </h3>
              <p className="text-gray-600">
                Automatically generated financial forecasts and projections
                based on your inputs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-20 px-4 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      activeFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    activeFaq === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-6 py-4 text-gray-600 border-t border-gray-200">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready for your business plan?
          </h2>
          <p className="text-xl mb-8">
            Get your SBA-ready plan in minutes, not weeks
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Start Now
          </button>
        </div>
      </div>
    </>
  );

  const FormView = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-6 flex items-center justify-between border-b border-gray-200">
          <Logo className="text-blue-600" />
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>
        </div>
        <div className="py-8">
          <BusinessPlanForm />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {showForm ? <FormView /> : <LandingContent />}
    </div>
  );
}
