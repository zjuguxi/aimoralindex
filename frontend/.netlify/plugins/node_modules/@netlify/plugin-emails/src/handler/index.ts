import { Handler } from "@netlify/functions";
import fs from "fs";
import { join } from "path";
import https from "https";

export const getEmailFromPath = (
  path: string
): { file: string; type: string } | undefined => {
  let fileFound: { file: string; type: string } | undefined;
  fs.readdirSync(path).forEach((file) => {
    if (fileFound !== undefined) {
      // break after getting first file
      return;
    }
    const fileType = file.split(".").pop();
    const filename = file.replace(/^.*[\\/]/, "").split(".")[0];
    if (filename === "index") {
      if (fileType === "mjml" || fileType === "html") {
        const fileContents = fs.readFileSync(`${path}/${file}`, "utf8");
        fileFound = { file: fileContents, type: fileType };
      }
    }
  });

  return fileFound;
};

interface IAttachment {
  content: string;
  filename: string;
  type: string;
}

export interface IEmailRequest {
  from: string;
  to: string;
  subject: string;
  html: string;
  cc?: string;
  bcc?: string;
  attachments?: IAttachment[];
}

interface IEmailConfig {
  apiKey: string;
  providerName: string;
  mailgunDomain?: string;
  mailgunHostRegion?: string;
}

export interface IMailRequest {
  configuration: IEmailConfig;
  request: IEmailRequest;
}

interface IFileFound {
  file: string;
  type: string;
}

export interface IMissingConfig {
  NETLIFY_EMAILS_SECRET?: boolean;
  NETLIFY_EMAILS_PROVIDER?: boolean;
  NETLIFY_EMAILS_PROVIDER_API_KEY?: boolean;
  NETLIFY_EMAILS_MAILGUN_HOST_REGION?: boolean;
  NETLIFY_EMAILS_MAILGUN_DOMAIN?: boolean;
}

export interface IRenderRequest {
  template: string;
  siteId: string;
  type: string;
  showParameterDictionary: boolean;
  parameters: { [key: string]: string | string[] };
}

const allowedPreviewEnvironments = ["deploy-preview", "branch-deploy", "dev"];

const getMissingConfig = (): IMissingConfig | false => {
  const missingConfig: IMissingConfig = {};
  let validConfig = true;

  if (!process.env.NETLIFY_EMAILS_PROVIDER) {
    missingConfig.NETLIFY_EMAILS_PROVIDER = true;
    validConfig = false;
  }
  if (!process.env.NETLIFY_EMAILS_PROVIDER_API_KEY) {
    missingConfig.NETLIFY_EMAILS_PROVIDER_API_KEY = true;
    validConfig = false;
  }
  if (process.env.NETLIFY_EMAILS_PROVIDER?.toLowerCase() === "mailgun") {
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

const makeRenderTemplateRequest = async (
  fileFound: IFileFound,
  parameters: { [key: string]: string | string[] }
): Promise<{
  html?: string;
  error?: string;
  status: number;
}> => {
  const renderRequest: IRenderRequest = {
    template: fileFound.file,
    siteId: process.env.SITE_ID as string,
    type: fileFound.type,
    showParameterDictionary: false,
    parameters,
  };
  return await new Promise((resolve, reject) => {
    const renderReq = https.request(
      {
        hostname: "netlify-integration-emails.netlify.app",
        path: "/.netlify/functions/render",
        method: "POST",
        headers: {
          "site-id": process.env.SITE_ID as string,
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          data += chunk;
        });

        res.on("end", () => {
          const response = JSON.parse(data) as {
            html?: string;
            error?: string;
          };
          resolve({ ...response, status: res.statusCode ?? 500 });
        });
      }
    );

    renderReq.on("error", (error) => {
      return reject(error);
    });

    renderReq.write(JSON.stringify(renderRequest));

    renderReq.end();
  });
};

const makeSendEmailRequest = async (
  mailRequest: IMailRequest
): Promise<{
  message: string;
  status: number;
}> => {
  return await new Promise((resolve, reject) => {
    const sendReq = https.request(
      {
        hostname: "netlify-integration-emails.netlify.app",
        path: "/.netlify/functions/send",
        method: "POST",
        headers: {
          "site-id": process.env.SITE_ID as string,
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          data += chunk;
        });

        res.on("end", () => {
          const response = JSON.parse(data) as {
            message: string;
          };
          const sendEmailResponse = {
            message: response.message,
            status: res.statusCode ?? 500,
          };
          resolve(sendEmailResponse);
        });
      }
    );

    sendReq.on("error", (error) => {
      return reject(error);
    });

    sendReq.write(JSON.stringify(mailRequest));

    sendReq.end();
  });
};

const handler: Handler = async (event) => {
  console.log(`Email handler received email request from path ${event.rawUrl}`);
  const missingConfig = getMissingConfig();

  const providerApiKey = process.env.NETLIFY_EMAILS_PROVIDER_API_KEY as string;
  const providerName = process.env.NETLIFY_EMAILS_PROVIDER as string;
  const emailTemplatesDirectory =
    process.env.NETLIFY_EMAILS_DIRECTORY ?? "./emails";

  const emailPath = event.rawUrl.match(/emails\/([A-z-]*)[?]?/)?.[1];

  // If missing configuration, render preview HTML and sending missing configuration object to window varialbe
  if (missingConfig) {
    const missingConfigString = Object.keys(missingConfig)
      .map((key) => {
        if (missingConfig[key as keyof IMissingConfig]) {
          return key;
        }
        return "";
      })
      .join(", ");
    console.error(
      `Email handler detected missing configuration: ${missingConfigString}`
    );

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
    const showEmailPreview = allowedPreviewEnvironments.includes(
      process.env.CONTEXT as string
    );

    if (!showEmailPreview) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Email previews are not allowed in the ${
            process.env.CONTEXT as string
          } environment`,
        }),
        headers: {
          "Content-Type": "text/plain",
        },
      };
    }

    if (!fs.existsSync(emailTemplatesDirectory)) {
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

    let emailTemplate: IFileFound | undefined;

    if (emailPath !== undefined) {
      if (!fs.existsSync(join(emailTemplatesDirectory, emailPath))) {
        console.log(
          `Preview path is not a valid email path - preview path received: ${emailPath}`
        );
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

      emailTemplate = getEmailFromPath(
        join(emailTemplatesDirectory, emailPath)
      );

      if (!emailTemplate) {
        console.log(
          `No email template found for preview path - preview path received: ${emailPath}. Please ensure that an index.mjml or index.html file exists in the email template folder.`
        );
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

    const validEmailPaths: string[] = [];

    fs.readdirSync(emailTemplatesDirectory).forEach((template) => {
      if (
        fs.existsSync(join(emailTemplatesDirectory, template, "index.html")) ||
        fs.existsSync(join(emailTemplatesDirectory, template, "index.mjml"))
      ) {
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
            template = ${JSON.stringify(emailTemplate?.file)}
            templateType = ${JSON.stringify(emailTemplate?.type)}
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

    if (
      event.headers["netlify-emails-secret"] !==
      process.env.NETLIFY_EMAILS_SECRET
    ) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: "Secret does not match",
        }),
      };
    }

    // If the email templates directory does not exist, return error
    if (!fs.existsSync(emailTemplatesDirectory)) {
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
          message:
            "You have not specified the email you wish to send in the URL",
        }),
      };
    }

    const fullEmailPath = `${emailTemplatesDirectory}/${emailPath}`;

    const emailPathExists = fs.existsSync(fullEmailPath);
    if (!emailPathExists) {
      console.error(`Email path does not exist: ${fullEmailPath}`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Email path ${fullEmailPath} does not exist`,
        }),
      };
    }

    const email = getEmailFromPath(fullEmailPath);
    if (!email) {
      console.error(`No email file found in directory: ${fullEmailPath}`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `No email file found in directory: ${fullEmailPath}`,
        }),
      };
    }

    const renderResponseJson = await makeRenderTemplateRequest(
      email,
      requestBody.parameters
    );

    if (renderResponseJson.error ?? !renderResponseJson.html) {
      console.error(
        `Error rendering email template: ${JSON.stringify(renderResponseJson)}`
      );
      return {
        statusCode: renderResponseJson.status,
        body: JSON.stringify({
          message: `Error rendering email template${
            renderResponseJson.error ? `: ${renderResponseJson.error}` : ""
          }`,
        }),
      };
    }

    const renderedTemplate = renderResponseJson.html;

    const configuration: IEmailConfig = {
      providerName,
      apiKey: providerApiKey,
      mailgunDomain: process.env.NETLIFY_EMAILS_MAILGUN_DOMAIN,
      mailgunHostRegion: process.env.NETLIFY_EMAILS_MAILGUN_HOST_REGION,
    };

    const request: IEmailRequest = {
      from: requestBody.from,
      to: requestBody.to,
      cc: requestBody.cc,
      bcc: requestBody.bcc,
      subject: requestBody.subject ?? "",
      html: renderedTemplate,
      attachments: requestBody.attachments,
    };

    const { message, status } = await makeSendEmailRequest({
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
};

export { handler };
