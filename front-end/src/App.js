import React, { useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

function App() {
  const [form, setForm] = useState({
    startingPoint: "",
    endingPoint: "",
    duration: "",
    location: "",
    numberOfTravellers: "",
    travelType: "",
    travelStyle: "",
    interests: "",
    mustHave: "",
    requirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTripPlan("");
    try {
      const res = await axios.post("http://localhost:3001/plan-trip", form);
      setTripPlan(res.data.tripPlan);
    } catch (err) {
      setTripPlan("Failed to generate trip plan.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Trip Planner</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(form).map(([key, value]) => (
            <div key={key}>
              <label className="block font-medium capitalize text-gray-700 mb-1">{key}:</label>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Planning..." : "Generate Trip Plan"}
          </button>
        </form>

        {tripPlan && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-2">Generated Trip Plan</h2>
            <div
              id="trip-plan"
              className="bg-gray-50 border p-4 rounded text-sm whitespace-pre-wrap"
            >
              {tripPlan}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => {
                const element = document.getElementById("trip-plan");
                html2pdf().from(element).save("trip-plan.pdf");
              }}
            >
              Download as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
