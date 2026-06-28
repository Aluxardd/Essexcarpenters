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
const originalHost = process.env.CONTACT_SMTP_HOST;
const originalPort = process.env.CONTACT_SMTP_PORT;
const originalUser = process.env.CONTACT_SMTP_USER;
const originalPass = process.env.CONTACT_SMTP_PASS;

function clearSmtpEnv() {
  delete process.env.CONTACT_FROM_EMAIL;
  delete process.env.CONTACT_SMTP_HOST;
  delete process.env.CONTACT_SMTP_PORT;
  delete process.env.CONTACT_SMTP_USER;
  delete process.env.CONTACT_SMTP_PASS;
}

function setValidSmtpEnv() {
  process.env.CONTACT_FROM_EMAIL = "Essex Carpenters <info@essexcarpenters.co.uk>";
  process.env.CONTACT_SMTP_HOST = "smtp.ionos.co.uk";
  process.env.CONTACT_SMTP_PORT = "587";
  process.env.CONTACT_SMTP_USER = "info@essexcarpenters.co.uk";
  process.env.CONTACT_SMTP_PASS = "smtp_password";
}

try {
  await runCase("GET method blocked", { method: "GET", body: {} }, async () => {
    clearSmtpEnv();
    delete globalThis.__CONTACT_SEND_MAIL__;
  });

  await runCase("POST missing env", { method: "POST", body: validPayload }, async () => {
    clearSmtpEnv();
    delete globalThis.__CONTACT_SEND_MAIL__;
  });

  await runCase("POST invalid payload", { method: "POST", body: { ...validPayload, email: "bad" } }, async () => {
    setValidSmtpEnv();
    globalThis.__CONTACT_SEND_MAIL__ = async () => ({ messageId: "ignored" });
  });

  await runCase("POST SMTP failure", { method: "POST", body: validPayload }, async () => {
    setValidSmtpEnv();
    globalThis.__CONTACT_SEND_MAIL__ = async () => {
      throw new Error("SMTP unavailable");
    };
  });

  await runCase("POST success path", { method: "POST", body: validPayload }, async () => {
    setValidSmtpEnv();
    globalThis.__CONTACT_SEND_MAIL__ = async () => ({ messageId: "ok" });
  });
} finally {
  if (originalFrom === undefined) {
    delete process.env.CONTACT_FROM_EMAIL;
  } else {
    process.env.CONTACT_FROM_EMAIL = originalFrom;
  }

  if (originalHost === undefined) {
    delete process.env.CONTACT_SMTP_HOST;
  } else {
    process.env.CONTACT_SMTP_HOST = originalHost;
  }

  if (originalPort === undefined) {
    delete process.env.CONTACT_SMTP_PORT;
  } else {
    process.env.CONTACT_SMTP_PORT = originalPort;
  }

  if (originalUser === undefined) {
    delete process.env.CONTACT_SMTP_USER;
  } else {
    process.env.CONTACT_SMTP_USER = originalUser;
  }

  if (originalPass === undefined) {
    delete process.env.CONTACT_SMTP_PASS;
  } else {
    process.env.CONTACT_SMTP_PASS = originalPass;
  }

  delete globalThis.__CONTACT_SEND_MAIL__;
}
