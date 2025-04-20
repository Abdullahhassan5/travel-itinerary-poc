require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("Gemini API Key:", process.env.GEMINI_API_KEY); // 👈 Log the API key for debugging

app.post("/plan-trip", async (req, res) => {
  try {
    const {
      startingPoint,
      endingPoint,
      duration,
      location,
      numberOfTravellers,
      travelType,
      travelStyle,
      interests,
      mustHave,
      requirements,
    } = req.body;

    const prompt = `Plan a trip with the following details:
- Starting Point: ${startingPoint}
- Ending Point: ${endingPoint}
- Duration: ${duration} days
- Location: ${location}
- Number of Travellers: ${numberOfTravellers}
- Travel Type: ${travelType}
- Travel Style: ${travelStyle}
- Interests: ${interests}
- Must Have: ${mustHave}
- Requirements: ${requirements}

Respond with a detailed travel plan.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // ✅ Use model name exactly
    const result = await model.generateContent(prompt);
    const tripPlan = result.response.text();

    res.json({ tripPlan });
  } catch (error) {
    console.error("Gemini API Error →", error); // 👈 Log full error
    res.status(500).json({ error: "Failed to generate trip plan." });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});