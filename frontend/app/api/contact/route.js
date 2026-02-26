import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // For now just log it
    console.log("Contact Form Data:", body);

    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}