"use client";

export default function Header({ showForm, setShowForm }) {
  return (
    <header className="w-full py-20 bg-gradient-to-b from-blue-600 to-blue-800 text-white text-center">
      <h1 className="text-4xl font-bold">SBA Planner</h1>
      <p className="mt-4 text-lg max-w-xl mx-auto">
        Generate a comprehensive, SBA-ready business plan from just a few
        inputs.
      </p>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-8 px-6 py-3 bg-white text-blue-700 font-semibold rounded shadow hover:bg-gray-100 transition"
        >
          Get Started
        </button>
      )}
    </header>
  );
}
