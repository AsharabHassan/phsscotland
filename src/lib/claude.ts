import Anthropic from "@anthropic-ai/sdk";
import type { AssessmentResult } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function analyseExterior(
  base64Image: string
): Promise<AssessmentResult> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: base64Image,
            },
          },
          {
            type: "text",
            text: `You are an expert exterior property surveyor for a Scottish home improvement company. Analyse this property exterior photo and return a JSON object with this exact structure:

{
  "propertyType": "mid-terrace" | "end-terrace" | "bungalow" | "semi-detached" | "detached",
  "issues": [
    { "name": "string", "severity": "low" | "medium" | "high", "description": "string" }
  ],
  "recommendations": [
    { "service": "wall-coating" | "roof-coating" | "chemical-cleaning" | "exterior-painting", "label": "string", "reason": "string" }
  ],
  "overallCondition": "good" | "fair" | "poor",
  "summary": "A 2-3 sentence summary of the property's exterior condition."
}

Look for: moss/algae growth, render cracks, discolouration, peeling paint, damaged pointing, damp patches, roof tile issues, gutter problems, window seal deterioration.

Return ONLY the JSON object, no markdown or explanation.`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text) as AssessmentResult;
}
