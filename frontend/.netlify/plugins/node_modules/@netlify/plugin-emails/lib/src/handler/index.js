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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.getEmailFromPath = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const https_1 = __importDefault(require("https"));
const getEmailFromPath = (path) => {
    let fileFound;
    fs_1.default.readdirSync(path).forEach((file) => {
        if (fileFound !== undefined) {
            // break after getting first file
            return;
        }
        const fileType = file.split(".").pop();
        const filename = file.replace(/^.*[\\/]/, "").split(".")[0];
        if (filename === "index") {
            if (fileType === "mjml" || fileType === "html") {
                const fileContents = fs_1.default.readFileSync(`${path}/${file}`, "utf8");
                fileFound = { file: fileContents, type: fileType };
            }
        }
    });
    return fileFound;
};
exports.getEmailFromPath = getEmailFromPath;
const allowedPreviewEnvironments = ["deploy-preview", "branch-deploy", "dev"];
const getMissingConfig = () => {
    var _a;
    const missingConfig = {};
    let validConfig = true;
    if (!process.env.NETLIFY_EMAILS_PROVIDER) {
        missingConfig.NETLIFY_EMAILS_PROVIDER = true;
        validConfig = false;
    }
    if (!process.env.NETLIFY_EMAILS_PROVIDER_API_KEY) {
        missingConfig.NETLIFY_EMAILS_PROVIDER_API_KEY = true;
        validConfig = false;
    }
    if (((_a = process.env.NETLIFY_EMAILS_PROVIDER) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "mailgun") {
        if (!process.env.NETLIFY_EMAILS_MAILGUN_HOST_REGION) {
            missingConfig.NETLIFY_EMAILS_MAILGUN_HOST_REGION = true;
            validConfig = false;
        }
        if (!process.env.NETLIFY_EMAILS_MAILGUN_DOMAIN) {
            missingConfig.NETLIFY_EMAILS_MAILGUN_DOMAIN = true;
            validConfig = false;
        }
    }
    if (!process.env.NETLIFY_EMAILS_SECRET) {
        missingConfig.NETLIFY_EMAILS_SECRET = true;
        validConfig = false;
    }
    return validConfig ? false : missingConfig;
};
const makeRenderTemplateRequest = (fileFound, parameters) => __awaiter(void 0, void 0, void 0, function* () {
    const renderRequest = {
        template: fileFound.file,
        siteId: process.env.SITE_ID,
        type: fileFound.type,
        showParameterDictionary: false,
        parameters,
    };
    return yield new Promise((resolve, reject) => {
        const renderReq = https_1.default.request({
            hostname: "netlify-integration-emails.netlify.app",
            path: "/.netlify/functions/render",
            method: "POST",
            headers: {
                "site-id": process.env.SITE_ID,
                "Content-Type": "application/json",
            },
        }, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                data += chunk;
            });
            res.on("end", () => {
                var _a;
                const response = JSON.parse(data);
                resolve(Object.assign(Object.assign({}, response), { status: (_a = res.statusCode) !== null && _a !== void 0 ? _a : 500 }));
            });
        });
        renderReq.on("error", (error) => {
            return reject(error);
        });
        renderReq.write(JSON.stringify(renderRequest));
        renderReq.end();
    });
});
const makeSendEmailRequest = (mailRequest) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        const sendReq = https_1.default.request({
            hostname: "netlify-integration-emails.netlify.app",
            path: "/.netlify/functions/send",
            method: "POST",
            headers: {
                "site-id": process.env.SITE_ID,
                "Content-Type": "application/json",
            },
        }, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                data += chunk;
            });
            res.on("end", () => {
                var _a;
                const response = JSON.parse(data);
                const sendEmailResponse = {
                    message: response.message,
                    status: (_a = res.statusCode) !== null && _a !== void 0 ? _a : 500,
                };
                resolve(sendEmailResponse);
            });
        });
        sendReq.on("error", (error) => {
            return reject(error);
        });
        sendReq.write(JSON.stringify(mailRequest));
        sendReq.end();
    });
});
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    console.log(`Email handler received email request from path ${event.rawUrl}`);
    const missingConfig = getMissingConfig();
    const providerApiKey = process.env.NETLIFY_EMAILS_PROVIDER_API_KEY;
    const providerName = process.env.NETLIFY_EMAILS_PROVIDER;
    const emailTemplatesDirectory = (_a = process.env.NETLIFY_EMAILS_DIRECTORY) !== null && _a !== void 0 ? _a : "./emails";
    const emailPath = (_b = event.rawUrl.match(/emails\/([A-z-]*)[?]?/)) === null || _b === void 0 ? void 0 : _b[1];
    // If missing configuration, render preview HTML and sending missing configuration object to window varialbe
    if (missingConfig) {
        const missingConfigString = Object.keys(missingConfig)
            .map((key) => {
            if (missingConfig[key]) {
                return key;
            }
            return "";
        })
            .join(", ");
        console.error(`Email handler detected missing configuration: ${missingConfigString}`);
        if (event.httpMethod === "POST") {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: `The emails integration is not configured correctly. We have detected the following configuration is missing: ${missingConfigString}`,
                }),
            };
        }
        return {
            statusCode: 200,
            body: `
          <html>
            <head>
            <link rel="stylesheet" href="https://netlify-integration-emails.netlify.app/main.css">
            <script>
              missingConfig = ${JSON.stringify(missingConfig)}
              siteId = ${JSON.stringify(process.env.SITE_ID)}
              templateName = ${JSON.stringify(emailPath)}
            </script>
            <script defer src='https://netlify-integration-emails.netlify.app/index.js'></script>
            </head>
            <div id='app'></div>
          </html>
          `,
        };
    }
    if (event.httpMethod === "GET") {
        const showEmailPreview = allowedPreviewEnvironments.includes(process.env.CONTEXT);
        if (!showEmailPreview) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: `Email previews are not allowed in the ${process.env.CONTEXT} environment`,
                }),
                headers: {
                    "Content-Type": "text/plain",
                },
            };
        }
        if (!fs_1.default.existsSync(emailTemplatesDirectory)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: `Email templates directory ${emailTemplatesDirectory} does not exist`,
                }),
                headers: {
                    "Content-Type": "text/plain",
                },
            };
        }
        let emailTemplate;
        if (emailPath !== undefined) {
            if (!fs_1.default.existsSync((0, path_1.join)(emailTemplatesDirectory, emailPath))) {
                console.log(`Preview path is not a valid email path - preview path received: ${emailPath}`);
                return {
                    statusCode: 200,
                    body: `
              <html>
                <head>
                <link rel="stylesheet" href="https://netlify-integration-emails.netlify.app/main.css">
                <script>
                  missingTemplate = ${JSON.stringify(true)}
                  siteId = ${JSON.stringify(process.env.SITE_ID)}
                  templateName = ${JSON.stringify(emailPath)}
                  emailDirectory = ${JSON.stringify(emailTemplatesDirectory)}
                </script>
                <script defer src='https://netlify-integration-emails.netlify.app/index.js'></script>
                </head>
                <div id='app'></div>
              </html>
              `,
                    headers: {
                        "Content-Type": "text/html",
                    },
                };
            }
            emailTemplate = (0, exports.getEmailFromPath)((0, path_1.join)(emailTemplatesDirectory, emailPath));
            if (!emailTemplate) {
                console.log(`No email template found for preview path - preview path received: ${emailPath}. Please ensure that an index.mjml or index.html file exists in the email template folder.`);
                return {
                    statusCode: 200,
                    body: `
              <html>
                <head>
                <link rel="stylesheet" href="https://netlify-integration-emails.netlify.app/main.css">
                <script>
                  missingTemplate = ${JSON.stringify(true)}
                  siteId = ${JSON.stringify(process.env.SITE_ID)}
                  templateName = ${JSON.stringify(emailPath)}
                  emailDirectory = ${JSON.stringify(emailTemplatesDirectory)}
                </script>
                <script defer src='https://netlify-integration-emails.netlify.app/index.js'></script>
                </head>
                <div id='app'></div>
              </html>
              `,
                    headers: {
                        "Content-Type": "text/html",
                    },
                };
            }
        }
        const validEmailPaths = [];
        fs_1.default.readdirSync(emailTemplatesDirectory).forEach((template) => {
            if (fs_1.default.existsSync((0, path_1.join)(emailTemplatesDirectory, template, "index.html")) ||
                fs_1.default.existsSync((0, path_1.join)(emailTemplatesDirectory, template, "index.mjml"))) {
                validEmailPaths.push(template);
            }
        });
        return {
            statusCode: 200,
            body: `
        <html>
          <head>
          <link rel="stylesheet" href="https://netlify-integration-emails.netlify.app/main.css">
          <script>
            emailPaths =  ${JSON.stringify(validEmailPaths)}
            template = ${JSON.stringify(emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.file)}
            templateType = ${JSON.stringify(emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.type)}
            siteId = ${JSON.stringify(process.env.SITE_ID)}
            siteName = ${JSON.stringify(process.env.SITE_NAME)}
            provider = ${JSON.stringify(providerName)}
            emailDirectory = ${JSON.stringify(emailTemplatesDirectory)}
            secret = ${JSON.stringify(process.env.NETLIFY_EMAILS_SECRET)}
            url = ${JSON.stringify(process.env.URL)}
            templateName = ${JSON.stringify(emailPath)}
          </script>
          <script defer src='https://netlify-integration-emails.netlify.app/index.js'></script>
          </head>
          <div id='app'></div>
        </html>
        `,
            headers: {
                "Content-Type": "text/html",
            },
        };
    }
    if (event.httpMethod === "POST") {
        if (!process.env.NETLIFY_EMAILS_SECRET) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Secret not set in NETLIFY_EMAILS_SECRET",
                }),
            };
        }
        if (event.headers["netlify-emails-secret"] !==
            process.env.NETLIFY_EMAILS_SECRET) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    message: "Secret does not match",
                }),
            };
        }
        // If the email templates directory does not exist, return error
        if (!fs_1.default.existsSync(emailTemplatesDirectory)) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Email templates directory ${emailTemplatesDirectory} does not exist`,
                }),
            };
        }
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Request body required",
                }),
            };
        }
        const requestBody = JSON.parse(event.body);
        if (!requestBody.from) {
            console.log("From address is required");
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "From address is required",
                }),
            };
        }
        if (!requestBody.to) {
            console.log("To address is required");
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "To address is required",
                }),
            };
        }
        if (!emailPath) {
            console.error(`Email path is not specified`);
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "You have not specified the email you wish to send in the URL",
                }),
            };
        }
        const fullEmailPath = `${emailTemplatesDirectory}/${emailPath}`;
        const emailPathExists = fs_1.default.existsSync(fullEmailPath);
        if (!emailPathExists) {
            console.error(`Email path does not exist: ${fullEmailPath}`);
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Email path ${fullEmailPath} does not exist`,
                }),
            };
        }
        const email = (0, exports.getEmailFromPath)(fullEmailPath);
        if (!email) {
            console.error(`No email file found in directory: ${fullEmailPath}`);
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: `No email file found in directory: ${fullEmailPath}`,
                }),
            };
        }
        const renderResponseJson = yield makeRenderTemplateRequest(email, requestBody.parameters);
        if ((_c = renderResponseJson.error) !== null && _c !== void 0 ? _c : !renderResponseJson.html) {
            console.error(`Error rendering email template: ${JSON.stringify(renderResponseJson)}`);
            return {
                statusCode: renderResponseJson.status,
                body: JSON.stringify({
                    message: `Error rendering email template${renderResponseJson.error ? `: ${renderResponseJson.error}` : ""}`,
                }),
            };
        }
        const renderedTemplate = renderResponseJson.html;
        const configuration = {
            providerName,
            apiKey: providerApiKey,
            mailgunDomain: process.env.NETLIFY_EMAILS_MAILGUN_DOMAIN,
            mailgunHostRegion: process.env.NETLIFY_EMAILS_MAILGUN_HOST_REGION,
        };
        const request = {
            from: requestBody.from,
            to: requestBody.to,
            cc: requestBody.cc,
            bcc: requestBody.bcc,
            subject: (_d = requestBody.subject) !== null && _d !== void 0 ? _d : "",
            html: renderedTemplate,
            attachments: requestBody.attachments,
        };
        const { message, status } = yield makeSendEmailRequest({
            configuration,
            request,
        });
        if (status !== 200) {
            console.error(`Error sending email: ${message}`);
        }
        return {
            statusCode: status,
            body: JSON.stringify({
                message,
            }),
        };
    }
    return {
        statusCode: 405,
        body: JSON.stringify({
            message: "Method not allowed",
        }),
    };
});
exports.handler = handler;
