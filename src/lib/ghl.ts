function getWebhookUrl() {
  return process.env.GHL_WEBHOOK_URL ?? "";
}

interface GhlContactInput {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  path?: string;
  selectedColor?: string;
  assessment?: {
    overallCondition?: string;
    summary?: string;
    issues?: { name: string; severity: string; description: string }[];
    recommendations?: { service: string; label: string; reason: string }[];
  };
  meta?: {
    meta_fbclid?: string;
    meta_fbc?: string;
    meta_fbp?: string;
    meta_eventId?: string;
    meta_eventName?: string;
    meta_sourceUrl?: string;
    meta_userAgent?: string;
    meta_clientIp?: string;
  };
}

export async function sendLeadToGhl(data: GhlContactInput) {
  const [firstName, ...rest] = data.name.split(" ");
  const lastName = rest.join(" ");

  // Flatten assessment into simple strings for GHL custom field mapping
  const issues = data.assessment?.issues ?? [];
  const recs = data.assessment?.recommendations ?? [];

  const payload: Record<string, string | number> = {
    // ── Standard contact fields (map directly in GHL) ──
    firstName,
    lastName,
    email: data.email,
    phone: data.phone,
    postalCode: data.postcode,
    source: "PHS AI Assessment",

    // ── Lead context ──
    entryPath: data.path ?? "",
    preferredColour: data.selectedColor ?? "",

    // ── Assessment data (flat for custom field mapping) ──
    assessmentCondition: data.assessment?.overallCondition ?? "",
    assessmentSummary: data.assessment?.summary ?? "",
    assessmentIssueCount: issues.length,
    assessmentIssues: issues
      .map((i) => `${i.name} (${i.severity}): ${i.description}`)
      .join(" | "),
    assessmentRecommendations: recs
      .map((r) => `${r.label}: ${r.reason}`)
      .join(" | "),
    assessmentServices: recs.map((r) => r.service).join(", "),

    // ── Meta / Facebook CAPI fields ──
    meta_fbclid: data.meta?.meta_fbclid ?? "",
    meta_fbc: data.meta?.meta_fbc ?? "",
    meta_fbp: data.meta?.meta_fbp ?? "",
    meta_eventId: data.meta?.meta_eventId ?? "",
    meta_eventName: data.meta?.meta_eventName ?? "Lead",
    meta_sourceUrl: data.meta?.meta_sourceUrl ?? "",
    meta_userAgent: data.meta?.meta_userAgent ?? "",
    meta_clientIp: data.meta?.meta_clientIp ?? "",
  };

  const res = await fetch(getWebhookUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`GHL webhook error: ${res.status}`);
  }

  return res.json().catch(() => ({ success: true }));
}
