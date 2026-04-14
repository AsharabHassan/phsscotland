import { NextRequest, NextResponse } from "next/server";
import { analyseExterior } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }
    const result = await analyseExterior(image);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Assessment error:", error);
    return NextResponse.json({ error: "Assessment failed" }, { status: 500 });
  }
}
