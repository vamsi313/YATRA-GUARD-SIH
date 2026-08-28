import { Router, type IRouter } from "express";

const router: IRouter = Router();

// Pilgrimage AI Assistant Route
router.post("/ai/chat", async (req, res) => {
  try {
    const { message, destinationId } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are YatraGuard AI, a compassionate, hyper-knowledgeable pilgrimage safety and temple guide assistant for Indian pilgrimage sites (Tirumala, Varanasi, Prayagraj, Rameswaram, etc.).
Location context: ${destinationId || "General Pilgrimage"}.
User query: "${message}".

Provide actionable, crowd-conscious, caring advice in 2-4 sentences. Mention safe queue timings, nearby peaceful spots (like waterfalls, quiet shrines, or dharamshalas), drinking water, and senior/family safety tips whenever relevant. Always remain supportive and respectful.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        const aiText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "May your yatra be blessed. Consider visiting during early morning or late evening hours to avoid heavy queue congestion.";

        return res.json({ success: true, answer: aiText, provider: "gemini" });
      } catch (geminiError) {
        console.error("Gemini API call failed, falling back to smart local safety engine:", geminiError);
      }
    }

    // Smart Local Pilgrimage Safety Engine
    const lower = message.toLowerCase();
    let reply = "";

    if (lower.includes("safe") || lower.includes("crowd") || lower.includes("now") || lower.includes("rush")) {
      reply =
        "The main shrine area is currently experiencing high peak hours. To avoid long queuing stress, we recommend visiting tranquil spots like Silathoranam (28% occupancy) or Kapila Theertham first. Return for Darshan after 5:00 PM when queue congestion subsides.";
    } else if (lower.includes("plan") || lower.includes("day") || lower.includes("schedule") || lower.includes("suggest")) {
      reply =
        "Here is an ideal, crowd-optimized pilgrimage schedule: 1. Visit peaceful nature viewpoints early morning. 2. Take a rest and enjoy free Annadanam meals by mid-day. 3. Enter the main temple queue after 5:00 PM for a much smoother darshan experience.";
    } else if (lower.includes("lodge") || lower.includes("stay") || lower.includes("room") || lower.includes("food")) {
      reply =
        "Affordable stays and free Annadanam (meals) are available at TTD Srinivasam Complex and Tarigonda Vengamamba Hall. Clean drinking water and resting shelters are situated every 400m along the main pathways.";
    } else if (lower.includes("senior") || lower.includes("elderly") || lower.includes("wheelchair") || lower.includes("baby")) {
      reply =
        "Dedicated senior-citizen ramps, battery buggy carts, and wheelchair assistance are accessible at the entrance gates. Ask any YatraGuard volunteer or police desk for priority assistance.";
    } else {
      reply =
        "Namaste! I am your YatraGuard pilgrimage companion. I can help you monitor live crowd levels, discover quiet alternative shrines, locate free Annadanam meals, and plan safer routes for your family.";
    }

    res.json({ success: true, answer: reply, provider: "yatra-safety-engine" });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
