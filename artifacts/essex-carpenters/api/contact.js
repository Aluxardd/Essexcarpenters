import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resend } from "resend";

const defaultRecipientEmail = "info@essexcarpenters.co.uk";
const phonePattern = /^[+\d][\d\s()-]{8,20}$/;

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
  const recipientEmail = getEnv("CONTACT_TO_EMAIL") ?? defaultRecipientEmail;

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
    to: recipientEmail,
    replyTo: email,
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