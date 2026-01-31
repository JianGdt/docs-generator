import { NextRequest, NextResponse } from "next/server";
import { reviewDocumentation } from "../../lib/services/groq/reviewer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ReviewRequest {
  data: string;
}

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: string;
  };
}

interface SuccessResponse {
  success: true;
  data: {
    review: any;
    reviewedAt: string;
  };
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const body: ReviewRequest = await request.json();

    const { data } = body;

    // Validate input
    if (!data || data.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Documentation is required and cannot be empty",
            code: "MISSING_DOCUMENTATION",
          },
        },
        { status: 400 },
      );
    }

    // Validate documentation length
    if (data.length > 50000) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Documentation is too large. Maximum 50,000 characters.",
            code: "DOCUMENTATION_TOO_LARGE",
          },
        },
        { status: 400 },
      );
    }

    console.log(`[Review API] Reviewing documentation (${data.length} chars)`);

    // Call review service
    const review = await reviewDocumentation(data);

    console.log("[Review API] Review completed successfully");

    return NextResponse.json({
      success: true,
      data: {
        review,
        reviewedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("[Review API Error]", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    // Determine status code and error details
    let statusCode = 500;
    let errorCode = "REVIEW_FAILED";
    let errorMessage = "Failed to review documentation";

    if (
      error.message?.includes("rate_limit") ||
      error.message?.includes("429")
    ) {
      statusCode = 429;
      errorCode = "RATE_LIMIT_EXCEEDED";
      errorMessage = "API rate limit exceeded. Please try again later.";
    } else if (
      error.message?.includes("authentication") ||
      error.message?.includes("API key") ||
      error.message?.includes("401")
    ) {
      statusCode = 401;
      errorCode = "AUTHENTICATION_FAILED";
      errorMessage = "API authentication failed. Please check configuration.";
    } else if (
      error.message?.includes("invalid JSON") ||
      error.message?.includes("Unterminated string")
    ) {
      errorCode = "INVALID_AI_RESPONSE";
      errorMessage =
        "AI returned an invalid response. Please try again or simplify the documentation.";
    } else if (error.message?.includes("context_length")) {
      statusCode = 400;
      errorCode = "CONTEXT_TOO_LARGE";
      errorMessage =
        "Documentation is too large for processing. Please reduce the size.";
    } else if (error.message?.includes("timeout")) {
      statusCode = 504;
      errorCode = "REQUEST_TIMEOUT";
      errorMessage = "Request timed out. Please try again.";
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: errorMessage,
          code: errorCode,
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
      },
      { status: statusCode },
    );
  }
}
