"use client";

import { useState } from "react";
import Image from "next/image";

const formSteps = [
  {
    title: "Business Status",
    fields: ["businessStatus"],
  },
  {
    title: "Basic Information",
    fields: [
      "businessName",
      "businessDescription",
      "email",
      "personnel",
      "legalStructure",
      "yearsInOperation",
      "currentRevenue",
      "currentEmployees",
    ],
  },
  {
    title: "Products & Services",
    fields: ["productsServices", "uniqueFeatures", "currentMarketPresence"],
  },
  {
    title: "Market Analysis",
    fields: ["targetMarket", "customerNeed", "competition", "marketPosition"],
  },
  {
    title: "Sales & Marketing",
    fields: [
      "pricingStrategy",
      "salesChannels",
      "brandMessage",
      "marketingMethods",
      "onlinePresence",
      "existingCustomerBase",
    ],
  },
  {
    title: "Operations",
    fields: [
      "location",
      "productionProcess",
      "inventoryFulfillment",
      "regulations",
      "operationalHistory",
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
      "historicalFinancials",
      "fundingPurpose",
      "qualityFeedback",
    ],
  },
];

const fieldLabels = {
  businessStatus: "Business Status",
  businessName: "Business Name",
  businessDescription: "Business Description (one sentence)",
  personnel: "Principal Members & Roles",
  legalStructure: "Legal Structure",
  yearsInOperation: "Years in Operation",
  currentRevenue: "Current Annual Revenue",
  currentEmployees: "Current Number of Employees",
  productsServices: "Products/Services Offered",
  uniqueFeatures: "Unique Features/Value Proposition",
  currentMarketPresence: "Current Market Presence and Track Record",
  targetMarket: "Target Market",
  customerNeed: "Customer Need/Problem",
  competition: "Competition & Differentiation",
  marketPosition: "Current Market Position",
  pricingStrategy: "Pricing Strategy",
  salesChannels: "Sales Channels",
  location: "Location & Facilities",
  productionProcess: "Production Process or Service Delivery",
  inventoryFulfillment: "Inventory & Fulfillment",
  brandMessage: "Brand Message",
  marketingMethods: "Marketing Methods",
  onlinePresence: "Online Presence Strategy",
  existingCustomerBase: "Existing Customer Base and Relationships",
  regulations: "Regulatory Requirements",
  operationalHistory: "Operational History and Improvements",
  shortTermGoals: "Short-term Goals (Next 12 Months)",
  longTermGoals: "Long-term Goals (2-5 Years)",
  scalabilityPlans: "Growth and Scalability Plans",
  initialFunding: "Funding Requirements",
  historicalFinancials: "Historical Financial Performance",
  fundingPurpose: "Purpose of SBA Funding",
  profitabilityTimeline: "Profitability Timeline/Projections",
  qualityFeedback: "Quality Control & Customer Feedback",
  email: "Email Address (for receiving your plan)",
};

const establishedOnlyFields = [
  "yearsInOperation",
  "currentRevenue",
  "currentEmployees",
  "currentMarketPresence",
  "marketPosition",
  "existingCustomerBase",
  "operationalHistory",
  "historicalFinancials",
];

export default function BusinessPlanForm() {
  const [formData, setFormData] = useState({
    businessStatus: "",
    businessName: "",
    businessDescription: "",
    personnel: "",
    legalStructure: "",
    yearsInOperation: "",
    currentRevenue: "",
    currentEmployees: "",
    productsServices: "",
    uniqueFeatures: "",
    currentMarketPresence: "",
    targetMarket: "",
    customerNeed: "",
    competition: "",
    marketPosition: "",
    pricingStrategy: "",
    salesChannels: "",
    location: "",
    productionProcess: "",
    inventoryFulfillment: "",
    brandMessage: "",
    marketingMethods: "",
    onlinePresence: "",
    existingCustomerBase: "",
    regulations: "",
    operationalHistory: "",
    shortTermGoals: "",
    longTermGoals: "",
    scalabilityPlans: "",
    initialFunding: "",
    historicalFinancials: "",
    fundingPurpose: "",
    profitabilityTimeline: "",
    qualityFeedback: "",
    email: "",
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Logo file size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userData", JSON.stringify(formData));
      if (logo) {
        formDataToSend.append("logo", logo);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/api/generatePlan`, {
        method: "POST",
        body: formDataToSend,
        mode: "cors",
        credentials: "omit",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate business plan");
      }

      if (data.emailSent) {
        setStatus({
          type: "success",
          message: `Success! Your business plan has been sent to ${formData.email}. Please check your email (including spam folder).`,
        });
        // Reset form
        setFormData({
          businessStatus: "",
          businessName: "",
          // ... reset all other fields
        });
        setLogo(null);
        setLogoPreview("");
        setCurrentStep(0);
      } else {
        setStatus({
          type: "error",
          message:
            data.emailError ||
            "Failed to send email. Please try again or contact support.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus({
        type: "error",
        message:
          error.message ||
          "An error occurred. Please try again or contact support.",
      });
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
    if (fieldName === "businessName" && currentStep === 1) {
      return (
        <>
          <div key={fieldName} className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              {fieldLabels[fieldName]}
            </label>
            <input
              type="text"
              name={fieldName}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData[fieldName]}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Company Logo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {logoPreview && (
              <div className="mt-2">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-w-[200px] max-h-[200px] object-contain"
                />
              </div>
            )}
          </div>
        </>
      );
    }
    // Skip established-only fields for new businesses
    if (
      establishedOnlyFields.includes(fieldName) &&
      formData.businessStatus !== "established"
    ) {
      return null;
    }

    // Special handling for business status field
    if (fieldName === "businessStatus") {
      return (
        <div key={fieldName} className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            {fieldLabels[fieldName]}
          </label>
          <select
            name={fieldName}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData[fieldName]}
            onChange={handleChange}
            required
          >
            <option value="">Select your business status</option>
            <option value="new">New Business</option>
            <option value="established">Established Business</option>
          </select>
        </div>
      );
    }

    const isTextArea = [
      "productsServices",
      "uniqueFeatures",
      "customerNeed",
      "competition",
      "productionProcess",
      "currentMarketPresence",
      "operationalHistory",
      "historicalFinancials",
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
      {status.type && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            status.type === "success"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
          }`}
        >
          <p className="text-center">{status.message}</p>
          {status.type === "success" && (
            <p className="text-center mt-2 text-sm">
              You can now close this window or start a new plan.
            </p>
          )}
        </div>
      )}

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
          {formSteps[currentStep].fields.map((fieldName) => (
            <div key={fieldName}>{renderField(fieldName)}</div>
          ))}
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
            disabled={currentStep === 0 || isLoading}
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
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Plan...
                </span>
              ) : (
                "Generate Plan"
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              disabled={isLoading}
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
