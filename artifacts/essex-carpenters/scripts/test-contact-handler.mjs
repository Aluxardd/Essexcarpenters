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

const originalFetch = global.fetch;
const originalKey = process.env.RESEND_API_KEY;
const originalFrom = process.env.CONTACT_FROM_EMAIL;

try {
  await runCase("GET method blocked", { method: "GET", body: {} }, async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_FROM_EMAIL;
    global.fetch = originalFetch;
  });

  await runCase("POST missing env", { method: "POST", body: validPayload }, async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_FROM_EMAIL;
    global.fetch = originalFetch;
  });

  await runCase("POST invalid payload", { method: "POST", body: { ...validPayload, email: "bad" } }, async () => {
    process.env.RESEND_API_KEY = "test_key";
    process.env.CONTACT_FROM_EMAIL = "site@example.com";
    global.fetch = originalFetch;
  });

  await runCase("POST resend failure", { method: "POST", body: validPayload }, async () => {
    process.env.RESEND_API_KEY = "test_key";
    process.env.CONTACT_FROM_EMAIL = "site@example.com";
    global.fetch = async () => ({ ok: false });
  });

  await runCase("POST success path", { method: "POST", body: validPayload }, async () => {
    process.env.RESEND_API_KEY = "test_key";
    process.env.CONTACT_FROM_EMAIL = "site@example.com";
    global.fetch = async () => ({ ok: true });
  });
} finally {
  if (originalKey === undefined) {
    delete process.env.RESEND_API_KEY;
  } else {
    process.env.RESEND_API_KEY = originalKey;
  }

  if (originalFrom === undefined) {
    delete process.env.CONTACT_FROM_EMAIL;
  } else {
    process.env.CONTACT_FROM_EMAIL = originalFrom;
  }

  global.fetch = originalFetch;
}
