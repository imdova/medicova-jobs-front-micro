import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Parse the query parameters from the URL
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    if (!params.token) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=No token", request.url),
      );
    }
    return NextResponse.redirect(
      new URL(`/google?token=${params.token}`, request.url),
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
