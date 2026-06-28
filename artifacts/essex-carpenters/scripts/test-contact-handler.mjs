import assert from "node:assert/strict";
import handler from "../api/contact.js";

function createRes() {
  const res = { statusCode: 200, headers: {}, body: null };
  res.setHeader = (k, v) => {
    res.headers[k] = v;
    return res;
  };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
}

async function runCase(name, req, setup) {
  if (setup) {
    await setup();
  }
  const res = createRes();
  await handler(req, res);
  console.log(`${name}: ${res.statusCode} ${JSON.stringify(res.body)}`);
}

const validPayload = {
  name: "John Smith",
  email: "john@example.com",
  phone: "+44 7700 900123",
  service: "Kitchen Installation",
  message: "Need a full kitchen installation quote for a 3-bed house.",
};

let capturedMailOptions = null;

const originalFrom = process.env.CONTACT_FROM_EMAIL;
const originalResendApiKey = process.env.RESEND_API_KEY;
const originalRecipient = process.env.CONTACT_TO_EMAIL;

function clearEmailEnv() {
  delete process.env.CONTACT_FROM_EMAIL;
  delete process.env.RESEND_API_KEY;
}

function setValidEmailEnv() {
  process.env.CONTACT_FROM_EMAIL = "Essex Carpenters <info@essexcarpenters.co.uk>";
  process.env.RESEND_API_KEY = "re_test_api_key";
  process.env.CONTACT_TO_EMAIL = "info@essexcarpenters.co.uk,website@essexcarpenters.co.uk";
}

try {
  await runCase("GET method blocked", { method: "GET", body: {} }, async () => {
    clearEmailEnv();
    delete globalThis.__CONTACT_SEND_MAIL__;
  });

  await runCase("POST missing env", { method: "POST", body: validPayload }, async () => {
    clearEmailEnv();
    delete globalThis.__CONTACT_SEND_MAIL__;
  });

  await runCase("POST invalid payload", { method: "POST", body: { ...validPayload, email: "bad" } }, async () => {
    setValidEmailEnv();
    globalThis.__CONTACT_SEND_MAIL__ = async () => ({ messageId: "ignored" });
  });

  await runCase("POST Resend failure", { method: "POST", body: validPayload }, async () => {
    setValidEmailEnv();
    globalThis.__CONTACT_SEND_MAIL__ = async () => {
      throw new Error("Resend unavailable");
    };
  });

  await runCase("POST success path", { method: "POST", body: validPayload }, async () => {
    setValidEmailEnv();
    globalThis.__CONTACT_SEND_MAIL__ = async (mailOptions) => {
      capturedMailOptions = mailOptions;
      return { messageId: "ok" };
    };
  });

  assert.ok(capturedMailOptions, "Expected the success path to capture email payload");
  assert.equal(capturedMailOptions.replyTo, validPayload.email);
  assert.equal(capturedMailOptions.subject, `Free quote request from ${validPayload.name}`);
  assert.deepEqual(capturedMailOptions.to, ["info@essexcarpenters.co.uk", "website@essexcarpenters.co.uk"]);
  assert.ok(capturedMailOptions.text.includes(validPayload.service));
  assert.ok(capturedMailOptions.html.includes("New Quote Request"));
  assert.ok(capturedMailOptions.html.includes("Project Details"));
  console.log("POST template assertions: ok");
} finally {
  if (originalFrom === undefined) {
    delete process.env.CONTACT_FROM_EMAIL;
  } else {
    process.env.CONTACT_FROM_EMAIL = originalFrom;
  }

  if (originalResendApiKey === undefined) {
    delete process.env.RESEND_API_KEY;
  } else {
    process.env.RESEND_API_KEY = originalResendApiKey;
  }

  if (originalRecipient === undefined) {
    delete process.env.CONTACT_TO_EMAIL;
  } else {
    process.env.CONTACT_TO_EMAIL = originalRecipient;
  }

  delete globalThis.__CONTACT_SEND_MAIL__;
}
