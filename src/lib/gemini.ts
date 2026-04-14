import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function generateAfterImage(
  base64Image: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: `You are visualising the result of professional exterior treatment on this property. Generate an image of the SAME property but showing it after professional wall coating, cleaning, and painting. The property should look freshly treated: clean walls, no moss or algae, fresh even colour, repaired cracks, clean gutters. Keep the same angle, same surroundings, same structure — only improve the exterior surfaces. Make it look realistic and professional.`,
          },
        ],
      },
    ],
  });

  const candidate = result.response.candidates?.[0];
  const part = candidate?.content?.parts?.find(
    (p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData
  );

  if (!part?.inlineData) {
    throw new Error("No image generated");
  }

  return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
}
