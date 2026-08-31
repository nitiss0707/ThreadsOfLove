const { Resend } = require("resend");

const TOPICS = new Set([
  "General question",
  "Donating items",
  "Volunteering",
  "Corporate partnership",
  "Media / press",
]);

module.exports = async function (context, req) {
  const body = req.body || {};
  const name = (body.name || "").toString().trim();
  const email = (body.email || "").toString().trim();
  const topic = TOPICS.has(body.topic) ? body.topic : "General question";
  const message = (body.message || "").toString().trim();

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    context.res = { status: 400, jsonBody: { error: "Please fill out all fields with a valid email." } };
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: "Threads of Love Foundation <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `Contact form: ${topic}`,
      text: `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`,
    });

    if (error) {
      context.log.error("Resend error", error);
      context.res = { status: 502, jsonBody: { error: "Failed to send message." } };
      return;
    }

    context.res = { status: 200, jsonBody: { ok: true } };
  } catch (err) {
    context.log.error("Unexpected error sending contact email", err);
    context.res = { status: 500, jsonBody: { error: "Unexpected server error." } };
  }
};
