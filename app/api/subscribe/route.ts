/** Handles newsletter subscription requests and their email notifications. */
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MMTThankYouEmail } from "@/lib/emails/mmtThankYouEmail";

/** Sends the new-subscriber notice to the admin and a confirmation email to the subscriber. */
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { email, firstName, lastName, jobTitle, company } = data;

    // Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 1️⃣ Send Admin Notification
    await transporter.sendMail({
      from: `"MMT Subscriptions" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "📬 New MMT Subscription",
      html: `
        <h2>New Subscriber</h2>
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Job Title:</b> ${jobTitle}</p>
        <p><b>Company:</b> ${company}</p>
      `,
    });

    // 2️⃣ Send Thank-You Email (Using Your HTML Template)
    await transporter.sendMail({
      from: `"Tooling Technology" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Thank You for Subscribing!",
      html: MMTThankYouEmail({ firstName }), // ⭐ TEMPLATE USED HERE
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
