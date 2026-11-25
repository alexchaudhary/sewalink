"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getApiBaseUrl = getApiBaseUrl;
exports.authHeaders = authHeaders;
exports.fetcher = fetcher;
var API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
/**
 * Returns the current API base URL.
 *
 * Expected .env.local:
 * NEXT_PUBLIC_API_URL=http://localhost:4000/api
 */
function getApiBaseUrl() {
    return API_BASE.replace(/\/+$/, "");
}
/**
 * Returns authentication headers for browser requests.
 */
function authHeaders() {
    if (typeof window === "undefined") {
        return {};
    }
    var token = window.localStorage.getItem("kamdarnepal_token");
    if (!token) {
        return {};
    }
    return {
        Authorization: "Bearer ".concat(token),
    };
}
/**
 * Build a complete API URL.
 *
 * Example:
 * fetcher("/auth/login")
 * =>
 * http://localhost:4000/api/auth/login
 */
function buildApiUrl(path) {
    var base = getApiBaseUrl();
    // Prevent accidental double slash
    var cleanPath = path.startsWith("/")
        ? path
        : "/".concat(path);
    return "".concat(base).concat(cleanPath);
}
/**
 * Main API fetcher.
 */
function fetcher(path_1) {
    return __awaiter(this, arguments, void 0, function (path, options) {
        var url, headers, isFormData, response, error_1, contentType, body, text, message;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = buildApiUrl(path);
                    headers = __assign(__assign({}, authHeaders()), (options.headers
                        ? Object.fromEntries(new Headers(options.headers).entries())
                        : {}));
                    isFormData = typeof FormData !== "undefined" &&
                        options.body instanceof FormData;
                    if (!isFormData && !headers["Content-Type"]) {
                        headers["Content-Type"] = "application/json";
                    }
                    console.log("🌐 [API REQUEST]", {
                        method: options.method || "GET",
                        url: url,
                        authenticated: !!headers.Authorization,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(url, __assign(__assign({}, options), { headers: headers }))];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("❌ [API NETWORK ERROR]", {
                        url: url,
                        error: error_1,
                    });
                    throw new Error("Cannot connect to the backend server. Please make sure the backend is running on http://localhost:4000.");
                case 4:
                    contentType = response.headers.get("content-type") || "";
                    body = null;
                    if (!contentType.includes("application/json")) return [3 /*break*/, 6];
                    return [4 /*yield*/, response.json().catch(function () { return null; })];
                case 5:
                    body = _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, response.text().catch(function () { return ""; })];
                case 7:
                    text = _a.sent();
                    body = text || null;
                    _a.label = 8;
                case 8:
                    console.log("📡 [API RESPONSE]", {
                        method: options.method || "GET",
                        url: url,
                        status: response.status,
                        ok: response.ok,
                        body: body,
                    });
                    if (!response.ok) {
                        message = (body === null || body === void 0 ? void 0 : body.message) ||
                            (body === null || body === void 0 ? void 0 : body.error) ||
                            (typeof body === "string" && body.trim()
                                ? body
                                : null) ||
                            "API request failed with status ".concat(response.status);
                        /**
                         * If backend says token is invalid/expired,
                         * remove the stale token so the frontend doesn't
                         * keep sending it forever.
                         */
                        if (response.status === 401 &&
                            typeof window !== "undefined") {
                            window.localStorage.removeItem("kamdarnepal_token");
                        }
                        throw new Error(message);
                    }
                    return [2 /*return*/, body];
            }
        });
    });
}
