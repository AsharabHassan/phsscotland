import { NextRequest, NextResponse } from "next/server";
import { createGhlContact } from "@/lib/ghl";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, postcode, path } = body;
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const result = await createGhlContact({ name, email, phone, postcode });
    return NextResponse.json({ success: true, contactId: result?.contact?.id, path });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
