import { NextRequest, NextResponse } from "next/server";
import { sendLeadToGhl } from "@/lib/ghl";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, postcode, path, selectedColor, assessment, meta } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Server-side values for Meta CAPI
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "";
    const serverUserAgent = req.headers.get("user-agent") ?? "";

    await sendLeadToGhl({
      name,
      email,
      phone,
      postcode,
      path,
      selectedColor,
      assessment,
      meta: {
        ...(meta ?? {}),
        meta_clientIp: clientIp,
        meta_userAgent: meta?.meta_userAgent || serverUserAgent,
      },
    });

    return NextResponse.json({ success: true, path });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
