import { generateAfterImage } from "@/lib/gemini";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
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
      }),
  })
) as jest.Mock;

describe("generateAfterImage", () => {
  it("returns a base64 data URL from Gemini", async () => {
    const result = await generateAfterImage("fakeBase64Input");
    expect(result).toContain("data:image/png;base64,");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("generativelanguage.googleapis.com"),
      expect.objectContaining({ method: "POST" })
    );
  });
});
