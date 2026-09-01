import { NextResponse } from "next/server";

const SUPABASE_URL = (
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://bcpohnzywbpjmtixhung.supabase.co"
).replace(/\/$/, "");

const ANON_KEY =
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export async function POST(request: Request) {
  let body: { phone?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  if (!phone && !email) {
    return NextResponse.json(
      { error: "Enter the mobile number or email your chair uses for you." },
      { status: 400 },
    );
  }

  if (!ANON_KEY) {
    return NextResponse.json(
      {
        error:
          "This form is not configured yet. Email admin@showbuz.app and we will remove your details.",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/dep-privacy-opt-out`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ phone, email }),
      },
    );
    const data = (await response.json()) as {
      ok?: boolean;
      message?: string;
      error?: string;
    };
    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.error ??
            "Could not complete the request. Email admin@showbuz.app.",
        },
        { status: response.status },
      );
    }
    return NextResponse.json({
      ok: true,
      message: data.message ?? "Request processed.",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not reach ShowBuz. Try again, or email admin@showbuz.app.",
      },
      { status: 502 },
    );
  }
}
