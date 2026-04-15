// Set env before importing the module
process.env.GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/test/webhook-trigger/test";

import { sendLeadToGhl } from "@/lib/ghl";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

describe("sendLeadToGhl", () => {
  beforeEach(() => jest.clearAllMocks());

  it("sends flat lead + meta data to GHL webhook", async () => {
    const result = await sendLeadToGhl({
      name: "John Smith",
      email: "john@test.com",
      phone: "+447700900000",
      postcode: "EH1 1AA",
      path: "photo",
      assessment: {
        overallCondition: "poor",
        summary: "Needs work",
        issues: [{ name: "Moss", severity: "high", description: "Moss on walls" }],
        recommendations: [{ service: "wall-coating", label: "Wall Coating", reason: "Protect walls" }],
      },
      meta: {
        meta_fbclid: "abc123",
        meta_fbc: "fb.1.123.abc",
        meta_fbp: "fb.1.123.xyz",
        meta_eventId: "evt-001",
        meta_eventName: "Lead",
        meta_sourceUrl: "https://app.phsscotland.com",
        meta_userAgent: "Mozilla/5.0",
        meta_clientIp: "1.2.3.4",
      },
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("leadconnectorhq.com"),
      expect.objectContaining({ method: "POST" })
    );

    // Verify payload is flat and contains all expected fields
    const call = (fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(call[1].body);

    expect(body.firstName).toBe("John");
    expect(body.lastName).toBe("Smith");
    expect(body.email).toBe("john@test.com");
    expect(body.phone).toBe("+447700900000");
    expect(body.postalCode).toBe("EH1 1AA");
    expect(body.source).toBe("PHS AI Assessment");
    expect(body.entryPath).toBe("photo");

    // Assessment fields are flat strings
    expect(body.assessmentCondition).toBe("poor");
    expect(body.assessmentSummary).toBe("Needs work");
    expect(body.assessmentIssueCount).toBe(1);
    expect(body.assessmentIssues).toContain("Moss (high)");
    expect(body.assessmentRecommendations).toContain("Wall Coating");
    expect(body.assessmentServices).toBe("wall-coating");

    // Meta CAPI fields
    expect(body.meta_fbclid).toBe("abc123");
    expect(body.meta_fbc).toBe("fb.1.123.abc");
    expect(body.meta_fbp).toBe("fb.1.123.xyz");
    expect(body.meta_eventId).toBe("evt-001");
    expect(body.meta_eventName).toBe("Lead");
    expect(body.meta_sourceUrl).toBe("https://app.phsscotland.com");
    expect(body.meta_userAgent).toBe("Mozilla/5.0");
    expect(body.meta_clientIp).toBe("1.2.3.4");

    expect(result.success).toBe(true);
  });
});
