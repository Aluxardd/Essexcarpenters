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

const originalFrom = process.env.CONTACT_FROM_EMAIL;
const originalResendApiKey = process.env.RESEND_API_KEY;

function clearEmailEnv() {
  delete process.env.CONTACT_FROM_EMAIL;
  delete process.env.RESEND_API_KEY;
}

function setValidEmailEnv() {
  process.env.CONTACT_FROM_EMAIL = "Essex Carpenters <info@essexcarpenters.co.uk>";
  process.env.RESEND_API_KEY = "re_test_api_key";
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
    globalThis.__CONTACT_SEND_MAIL__ = async () => ({ messageId: "ok" });
  });
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

  delete globalThis.__CONTACT_SEND_MAIL__;
}
