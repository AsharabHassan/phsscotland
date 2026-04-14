import { analyseExterior } from "@/lib/claude";

jest.mock("@anthropic-ai/sdk", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [
            {
              type: "text",
              text: JSON.stringify({
                propertyType: "semi-detached",
                issues: [
                  { name: "Moss Growth", severity: "high", description: "Moss on north wall" },
                ],
                recommendations: [
                  { service: "chemical-cleaning", label: "Chemical Cleaning", reason: "Remove biological growth" },
                ],
                overallCondition: "fair",
                summary: "Property shows weathering signs.",
              }),
            },
          ],
        }),
      },
    })),
  };
});

describe("analyseExterior", () => {
  it("returns a valid AssessmentResult from a base64 image", async () => {
    const result = await analyseExterior("fakeBase64ImageData");
    expect(result.propertyType).toBe("semi-detached");
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].name).toBe("Moss Growth");
    expect(result.overallCondition).toBe("fair");
    expect(result.recommendations).toHaveLength(1);
  });
});
