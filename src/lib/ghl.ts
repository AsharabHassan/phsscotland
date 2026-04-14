const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID ?? "";
const GHL_BASE = "https://services.leadconnectorhq.com";

interface GhlContactInput {
  name: string;
  email: string;
  phone: string;
  postcode: string;
}

export async function createGhlContact(data: GhlContactInput) {
  const [firstName, ...rest] = data.name.split(" ");
  const lastName = rest.join(" ");

  const res = await fetch(`${GHL_BASE}/contacts/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GHL_API_KEY}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email: data.email,
      phone: data.phone,
      locationId: GHL_LOCATION_ID,
      address1: data.postcode,
      source: "PHS AI Assessment",
    }),
  });

  if (!res.ok) {
    throw new Error(`GHL API error: ${res.status}`);
  }

  return res.json();
}
