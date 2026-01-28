import { NextRequest, NextResponse } from "next/server";
import { reviewDocumentation } from "../../lib/services/groq/reviewer";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ReviewRequest {
  data: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReviewRequest = await request.json();

    const { data } = body;

    if (!data || data.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "documentation is required and cannot be empty",
            code: "MISSING_DOCUMENTATION",
          },
        },
        { status: 400 },
      );
    }

    const review = await reviewDocumentation(data);

    return NextResponse.json({
      success: true,
      data: {
        review,
        reviewedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("[Review API Error]", error);

    let statusCode = 500;
    if (error.message?.includes("rate_limit")) {
      statusCode = 429;
    } else if (error.message?.includes("authentication")) {
      statusCode = 401;
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || "Failed to review documentation",
          code: "REVIEW_FAILED",
        },
      },
      { status: statusCode },
    );
  }
}
