"use client";

import { useState } from "react";
import PlanModal from "./PlanModal";

const formSteps = [
  {
    title: "Basic Information",
    fields: [
      "businessName",
      "businessDescription",
      "personnel",
      "legalStructure",
    ],
  },
  {
    title: "Products & Services",
    fields: ["productsServices", "uniqueFeatures"],
  },
  {
    title: "Market Analysis",
    fields: ["targetMarket", "customerNeed", "competition"],
  },
  {
    title: "Sales & Marketing",
    fields: [
      "pricingStrategy",
      "salesChannels",
      "brandMessage",
      "marketingMethods",
      "onlinePresence",
    ],
  },
  {
    title: "Operations",
    fields: [
      "location",
      "productionProcess",
      "inventoryFulfillment",
      "regulations",
    ],
  },
  {
    title: "Goals & Financials",
    fields: [
      "shortTermGoals",
      "longTermGoals",
      "scalabilityPlans",
      "initialFunding",
      "profitabilityTimeline",
      "qualityFeedback",
    ],
  },
];

const fieldLabels = {
  businessName: "Business Name",
  businessDescription: "Business Description (one sentence)",
  personnel: "Principal Members & Roles",
  legalStructure: "Legal Structure",
  productsServices: "Products/Services Offered",
  uniqueFeatures: "Unique Features/Value Proposition",
  targetMarket: "Target Market",
  customerNeed: "Customer Need/Problem",
  competition: "Competition & Differentiation",
  pricingStrategy: "Pricing Strategy",
  salesChannels: "Sales Channels",
  location: "Location & Facilities",
  productionProcess: "Production Process or Service Delivery",
  inventoryFulfillment: "Inventory & Fulfillment",
  brandMessage: "Brand Message",
  marketingMethods: "Marketing Methods",
  onlinePresence: "Online Presence Strategy",
  regulations: "Regulatory Requirements",
  shortTermGoals: "Short-term Goals",
  longTermGoals: "Long-term Goals",
  scalabilityPlans: "Scalability Plans",
  initialFunding: "Initial Funding Requirements",
  profitabilityTimeline: "Profitability Timeline",
  qualityFeedback: "Quality Control & Customer Feedback",
};

export default function BusinessPlanForm() {
  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    personnel: "",
    legalStructure: "",
    productsServices: "",
    uniqueFeatures: "",
    targetMarket: "",
    customerNeed: "",
    competition: "",
    pricingStrategy: "",
    salesChannels: "",
    location: "",
    productionProcess: "",
    inventoryFulfillment: "",
    brandMessage: "",
    marketingMethods: "",
    onlinePresence: "",
    regulations: "",
    shortTermGoals: "",
    longTermGoals: "",
    scalabilityPlans: "",
    initialFunding: "",
    profitabilityTimeline: "",
    qualityFeedback: "",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/generatePlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData: formData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedPlan(data.plan);
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Error generating business plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / formSteps.length) * 100;

  const renderField = (fieldName) => {
    const isTextArea = [
      "productsServices",
      "uniqueFeatures",
      "customerNeed",
      "competition",
      "productionProcess",
    ].includes(fieldName);

    return (
      <div key={fieldName} className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          {fieldLabels[fieldName]}
        </label>
        {isTextArea ? (
          <textarea
            name={fieldName}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={formData[fieldName]}
            onChange={handleChange}
            required
          />
        ) : (
          <input
            type="text"
            name={fieldName}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData[fieldName]}
            onChange={handleChange}
            required
          />
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Step {currentStep + 1} of {formSteps.length}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
            ></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {formSteps[currentStep].title}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {formSteps[currentStep].fields.map(renderField)}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentStep === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={currentStep === 0}
          >
            Previous
          </button>

          {currentStep === formSteps.length - 1 ? (
            <button
              type="submit"
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Plan"}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </form>

      {showModal && (
        <PlanModal plan={generatedPlan} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
