import { generateAfterImage } from "@/lib/gemini";

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    inlineData: {
                      mimeType: "image/png",
                      data: "fakeGeneratedBase64",
                    },
                  },
                ],
              },
            },
          ],
        },
      }),
    }),
  })),
}));

describe("generateAfterImage", () => {
  it("returns a base64 data URL from Gemini", async () => {
    const result = await generateAfterImage("fakeBase64Input");
    expect(result).toContain("data:image/png;base64,");
  });
});
