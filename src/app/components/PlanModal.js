"use client";

export default function PlanModal({ plan, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your SBA-Ready Business Plan
          </h2>
          <p className="text-gray-600">
            Your business plan has been generated successfully.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-[60vh] overflow-y-auto">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            {plan}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              const blob = new Blob([plan], { type: "text/plain" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "business-plan.txt";
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Download Plan
          </button>
        </div>
      </div>
    </div>
  );
}
