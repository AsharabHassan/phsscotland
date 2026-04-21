function getWebhookUrl() {
  return process.env.GHL_WEBHOOK_URL ?? "";
}

const MAX_ISSUE_SLOTS = 5;
const MAX_RECOMMENDATION_SLOTS = 5;

interface GhlContactInput {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  path?: string;
  selectedColor?: string;
  assessment?: {
    propertyType?: string;
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
  const [firstName, ...rest] = data.name.trim().split(/\s+/);
  const lastName = rest.join(" ");

  const issues = data.assessment?.issues ?? [];
  const recs = data.assessment?.recommendations ?? [];

  // Each issue gets its own set of top-level fields so GHL can map
  // issue1Name, issue1Severity, issue1Description, etc. individually.
  const issueFields: Record<string, string> = {};
  for (let i = 0; i < MAX_ISSUE_SLOTS; i++) {
    const issue = issues[i];
    const n = i + 1;
    issueFields[`issue${n}Name`] = issue?.name ?? "";
    issueFields[`issue${n}Severity`] = issue?.severity ?? "";
    issueFields[`issue${n}Description`] = issue?.description ?? "";
  }

  const recFields: Record<string, string> = {};
  for (let i = 0; i < MAX_RECOMMENDATION_SLOTS; i++) {
    const rec = recs[i];
    const n = i + 1;
    recFields[`recommendation${n}Service`] = rec?.service ?? "";
    recFields[`recommendation${n}Label`] = rec?.label ?? "";
    recFields[`recommendation${n}Reason`] = rec?.reason ?? "";
  }

  const payload: Record<string, string | number> = {
    // ── Standard contact fields (auto-map in GHL) ──
    firstName,
    lastName,
    fullName: data.name,
    email: data.email,
    phone: data.phone,
    postalCode: data.postcode,
    source: "PHS AI Assessment",

    // ── Lead context ──
    entryPath: data.path ?? "",
    preferredColour: data.selectedColor ?? "",
    propertyType: data.assessment?.propertyType ?? "",

    // ── Assessment overview ──
    assessmentCondition: data.assessment?.overallCondition ?? "",
    assessmentSummary: data.assessment?.summary ?? "",
    assessmentIssueCount: issues.length,
    assessmentRecommendationCount: recs.length,

    // ── Combined summary strings (nice for single at-a-glance GHL field) ──
    assessmentIssues: issues
      .map((i) => `${i.name} (${i.severity}): ${i.description}`)
      .join(" | "),
    assessmentRecommendations: recs
      .map((r) => `${r.label}: ${r.reason}`)
      .join(" | "),
    assessmentServices: recs.map((r) => r.service).join(", "),

    // ── Per-item fields (map each individually in GHL) ──
    ...issueFields,
    ...recFields,

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
