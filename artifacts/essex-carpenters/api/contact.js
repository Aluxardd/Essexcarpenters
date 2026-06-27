"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
var recipientEmail = "info@essexcarpenters.co.uk";
var phonePattern = /^[+\d][\d\s()-]{8,20}$/;
function validatePayload(payload) {
    var _a, _b, _c, _d, _e;
    var name = String((_a = payload.name) !== null && _a !== void 0 ? _a : "").trim();
    var email = String((_b = payload.email) !== null && _b !== void 0 ? _b : "").trim();
    var phone = String((_c = payload.phone) !== null && _c !== void 0 ? _c : "").trim();
    var service = String((_d = payload.service) !== null && _d !== void 0 ? _d : "").trim();
    var message = String((_e = payload.message) !== null && _e !== void 0 ? _e : "").trim();
    if (!/^[A-Za-z\s'-]{2,}$/.test(name)) {
        return { error: "Name can only contain letters, spaces, apostrophes, or hyphens." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: "Please enter a valid email address." };
    }
    var phoneDigits = phone.replace(/\D/g, "");
    if (!phonePattern.test(phone) || phoneDigits.length < 10 || phoneDigits.length > 15) {
        return { error: "Please enter a valid phone number." };
    }
    if (!service) {
        return { error: "Please select a service." };
    }
    if (message.length < 10) {
        return { error: "Please tell us a bit about your project." };
    }
    return { data: { name: name, email: email, phone: phone, service: service, message: message } };
}
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var resendApiKey, fromEmail, result, _a, name, email, phone, service, message, response;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (req.method !== "POST") {
                        res.setHeader("Allow", "POST");
                        return [2 /*return*/, res.status(405).json({ error: "Method not allowed" })];
                    }
                    resendApiKey = process.env.RESEND_API_KEY;
                    fromEmail = process.env.CONTACT_FROM_EMAIL;
                    if (!resendApiKey || !fromEmail) {
                        return [2 /*return*/, res.status(500).json({
                                error: "Email delivery is not configured. Please set RESEND_API_KEY and CONTACT_FROM_EMAIL.",
                            })];
                    }
                    result = validatePayload((_b = req.body) !== null && _b !== void 0 ? _b : {});
                    if ("error" in result) {
                        return [2 /*return*/, res.status(400).json({ error: result.error })];
                    }
                    _a = result.data, name = _a.name, email = _a.email, phone = _a.phone, service = _a.service, message = _a.message;
                    return [4 /*yield*/, fetch("https://api.resend.com/emails", {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer ".concat(resendApiKey),
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                from: fromEmail,
                                to: recipientEmail,
                                reply_to: email,
                                subject: "Free quote request from ".concat(name),
                                text: [
                                    "Name: ".concat(name),
                                    "Email: ".concat(email),
                                    "Phone: ".concat(phone),
                                    "Service: ".concat(service),
                                    "",
                                    "Project details:",
                                    message,
                                ].join("\n"),
                            }),
                        })];
                case 1:
                    response = _c.sent();
                    if (!response.ok) {
                        return [2 /*return*/, res.status(502).json({ error: "Unable to send your enquiry right now. Please try again later." })];
                    }
                    return [2 /*return*/, res.status(200).json({ ok: true })];
            }
        });
    });
}
