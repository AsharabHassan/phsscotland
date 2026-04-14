import { createGhlContact } from "@/lib/ghl";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ contact: { id: "abc123" } }),
  })
) as jest.Mock;

describe("createGhlContact", () => {
  beforeEach(() => jest.clearAllMocks());

  it("sends contact data to GHL API", async () => {
    const result = await createGhlContact({
      name: "John Smith",
      email: "john@test.com",
      phone: "+447700900000",
      postcode: "EH1 1AA",
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("leadconnectorhq.com"),
      expect.objectContaining({ method: "POST" })
    );
    expect(result.contact.id).toBe("abc123");
  });
});
