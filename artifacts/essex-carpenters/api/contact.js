import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resend } from "resend";

const defaultRecipientEmail = "info@essexcarpenters.co.uk";
const phonePattern = /^[+\d][\d\s()-]{8,20}$/;

function parseRecipientEmails(value) {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return [defaultRecipientEmail];
  }

  const recipients = raw
    .split(/[;,]/)
    .map((email) => email.trim())
    .filter(Boolean);

  return recipients.length > 0 ? recipients : [defaultRecipientEmail];
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseEnvFile(content) {
  const parsed = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = stripWrappingQuotes(line.slice(separatorIndex + 1).trim());

    if (key) {
      parsed[key] = value;
    }
  }

  return parsed;
}

function loadFallbackEnv() {
  const apiDirectory = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(apiDirectory, "..");
  const envFilePaths = [path.join(projectRoot, ".env.local"), path.join(projectRoot, ".env")];

  let envValues = {};

  for (const envFilePath of envFilePaths) {
    if (!fs.existsSync(envFilePath)) {
      continue;
    }

    const content = fs.readFileSync(envFilePath, "utf8");
    envValues = { ...envValues, ...parseEnvFile(content) };
  }

  return envValues;
}

function getEnv(name) {
  const processValue = process.env[name];

  if (processValue) {
    return processValue;
  }

  return loadFallbackEnv()[name];
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildQuoteRequestEmailHtml({ name, email, phone, service, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeService = escapeHtml(service);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br />");

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>New Quote Request</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f7f5;font-family:Arial,sans-serif;color:#1f1f1f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f7f5;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e8e8e4;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;background:linear-gradient(135deg,#3a3027,#1f1a15);color:#ffffff;">
                <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;opacity:0.85;">Essex Carpenters</p>
                <h1 style="margin:0;font-size:24px;line-height:1.3;">New Quote Request</h1>
                <p style="margin:10px 0 0 0;font-size:14px;opacity:0.92;">A new enquiry was submitted from the website form.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 10px;">
                  <tr>
                    <td style="width:32%;font-weight:bold;color:#4a4a4a;">Name</td>
                    <td style="background:#f4f4f1;border:1px solid #ecece8;border-radius:8px;padding:10px 12px;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold;color:#4a4a4a;">Email</td>
                    <td style="background:#f4f4f1;border:1px solid #ecece8;border-radius:8px;padding:10px 12px;">${safeEmail}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold;color:#4a4a4a;">Phone</td>
                    <td style="background:#f4f4f1;border:1px solid #ecece8;border-radius:8px;padding:10px 12px;">${safePhone}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold;color:#4a4a4a;">Service</td>
                    <td style="background:#f4f4f1;border:1px solid #ecece8;border-radius:8px;padding:10px 12px;">${safeService}</td>
                  </tr>
                </table>
                <div style="margin-top:16px;">
                  <p style="margin:0 0 8px 0;font-weight:bold;color:#4a4a4a;">Project Details</p>
                  <div style="background:#f4f4f1;border:1px solid #ecece8;border-radius:8px;padding:14px 12px;font-size:14px;line-height:1.6;color:#1f1f1f;">${safeMessage}</div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendWithConfiguredTransport(mailOptions, resendConfig) {
  if (typeof globalThis.__CONTACT_SEND_MAIL__ === "function") {
    return globalThis.__CONTACT_SEND_MAIL__(mailOptions, resendConfig);
  }

  const resend = new Resend(resendConfig.apiKey);
  const result = await resend.emails.send(mailOptions);

  if (result.error) {
    const error = new Error(result.error.message || "Resend email send failed");
    error.code = result.error.name;
    throw error;
  }

  return result;
}

function validatePayload(payload) {
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const fromEmail = getEnv("CONTACT_FROM_EMAIL");
  const resendApiKey = getEnv("RESEND_API_KEY");
  const recipientEmails = parseRecipientEmails(getEnv("CONTACT_TO_EMAIL"));

  if (!fromEmail || !resendApiKey) {
    const missing = [
      !fromEmail ? "CONTACT_FROM_EMAIL" : null,
      !resendApiKey ? "RESEND_API_KEY" : null,
    ].filter(Boolean);

    return res.status(500).json({
      error: `Email delivery is not configured. Missing: ${missing.join(", ")}. Set these in environment variables or .env.local.`,
    });
  }

  const result = validatePayload(req.body ?? {});

  if ("error" in result) {
    return res.status(400).json({ error: result.error });
  }

  const { name, email, phone, service, message } = result.data;

  const mailOptions = {
    from: fromEmail,
    to: recipientEmails,
    replyTo: email,
    subject: `Free quote request from ${name}`,
    html: buildQuoteRequestEmailHtml({ name, email, phone, service, message }),
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Service: ${service}`,
      "",
      "Project details:",
      message,
    ].join("\n"),
  };

  try {
    await sendWithConfiguredTransport(mailOptions, { apiKey: resendApiKey });
  } catch (error) {
    console.error("Contact email send failed", {
      code: error?.code,
      message: error?.message,
    });

    if (process.env.NODE_ENV !== "production") {
      return res.status(502).json({
        error: "Unable to send your enquiry right now. Please check Resend API key and sender domain settings.",
        resendErrorCode: error?.code ?? null,
      });
    }

    return res.status(502).json({ error: "Unable to send your enquiry right now. Please try again later." });
  }

  return res.status(200).json({ ok: true });
}