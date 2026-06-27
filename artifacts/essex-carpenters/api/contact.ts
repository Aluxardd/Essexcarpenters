const recipientEmail = "info@essexcarpenters.co.uk";
const phonePattern = /^[+\d][\d\s()-]{8,20}$/;

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
};

function validatePayload(payload: ContactPayload) {
  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const service = String(payload.service ?? "").trim();
  const message = String(payload.message ?? "").trim();

  if (!/^[A-Za-z\s'-]{2,}$/.test(name)) {
    return { error: "Name can only contain letters, spaces, apostrophes, or hyphens." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const phoneDigits = phone.replace(/\D/g, "");

  if (!phonePattern.test(phone) || phoneDigits.length < 10 || phoneDigits.length > 15) {
    return { error: "Please enter a valid phone number." };
  }

  if (!service) {
    return { error: "Please select a service." };
  }

  if (message.length < 10) {
    return { error: "Please tell us a bit about your project." };
  }

  return { data: { name, email, phone, service, message } };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return res.status(500).json({
      error: "Email delivery is not configured. Please set RESEND_API_KEY and CONTACT_FROM_EMAIL.",
    });
  }

  const result = validatePayload(req.body ?? {});

  if ("error" in result) {
    return res.status(400).json({ error: result.error });
  }

  const { name, email, phone, service, message } = result.data;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: recipientEmail,
      reply_to: email,
      subject: `Free quote request from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Service: ${service}`,
        "",
        "Project details:",
        message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    return res.status(502).json({ error: "Unable to send your enquiry right now. Please try again later." });
  }

  return res.status(200).json({ ok: true });
}
