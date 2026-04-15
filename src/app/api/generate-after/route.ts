import { NextRequest, NextResponse } from "next/server";
import { generateAfterImage } from "@/lib/gemini";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { image, color, mimeType } = await req.json();
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }
    const afterImage = await generateAfterImage(image, color, mimeType);
    return NextResponse.json({ image: afterImage });
  } catch (error) {
    console.error("After-image generation error:", error);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}
