// emailTemplates.js — Forge AI transactional emails
// Table-based layout + inline styles so it renders in Gmail, Outlook, Apple Mail.

const BRAND = {
  name: "Forge AI",
  ink: "#101828",
  body: "#475467",
  muted: "#98A2B3",
  line: "#E4E7EC",
  page: "#EEF1F6",
  card: "#FFFFFF",
  accent: "#3D5AFE",
  spark: "#FF8A3D",
  supportEmail: "support@forgeai.app",
  appUrl: "http://localhost",
};

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Prevents user-supplied values (names, device strings) from injecting HTML.
const esc = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const greeting = (userName) => `Hi ${userName ? esc(userName) : "there"},`;

const button = (href, label) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
    <tr>
      <td style="border-radius:8px;background:${BRAND.accent};">
        <a href="${esc(href)}" target="_blank"
           style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:8px;">
          ${esc(label)}
        </a>
      </td>
    </tr>
  </table>`;

const otpBoxes = (otp) => {
  const cells = String(otp)
    .split("")
    .map(
      (digit) => `
      <td align="center" width="46" style="width:46px;height:56px;background:#F5F7FF;border:1px solid #D5DBFF;border-radius:8px;font-family:'SFMono-Regular',Consolas,'Courier New',monospace;font-size:28px;font-weight:700;color:${BRAND.ink};">
        ${esc(digit)}
      </td>
      <td width="8" style="width:8px;font-size:0;line-height:0;">&nbsp;</td>`
    )
    .join("");

  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px auto;">
    <tr>${cells}</tr>
  </table>`;
};

const detailRows = (rows) =>
  rows
    .filter(([, value]) => value)
    .map(
      ([label, value], i, arr) => `
      <tr>
        <td style="padding:12px 0;${i < arr.length - 1 ? `border-bottom:1px solid ${BRAND.line};` : ""}font-family:${FONT};font-size:14px;color:${BRAND.muted};width:120px;">${esc(label)}</td>
        <td style="padding:12px 0;${i < arr.length - 1 ? `border-bottom:1px solid ${BRAND.line};` : ""}font-family:${FONT};font-size:14px;color:${BRAND.ink};font-weight:600;">${esc(value)}</td>
      </tr>`
    )
    .join("");

/**
 * Shared shell: logo, card, footer.
 * preheader = the grey preview text shown next to the subject in inboxes.
 */
const layout = ({ preheader, title, content }) => `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.page};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${esc(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.page};">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;">
          <!-- Logo -->
          <tr>
            <td style="padding:0 4px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:32px;height:32px;background:${BRAND.ink};border-radius:8px;text-align:center;font-family:${FONT};font-size:18px;font-weight:800;color:${BRAND.spark};line-height:32px;">F</td>
                  <td style="padding-left:10px;font-family:${FONT};font-size:18px;font-weight:700;color:${BRAND.ink};letter-spacing:-0.2px;">${BRAND.name}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:${BRAND.card};border-radius:14px;border:1px solid ${BRAND.line};padding:40px 36px;font-family:${FONT};color:${BRAND.body};font-size:15px;line-height:24px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 8px 0;font-family:${FONT};font-size:12px;line-height:18px;color:${BRAND.muted};text-align:center;">
              Need help? Contact us at
              <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.muted};text-decoration:underline;">${BRAND.supportEmail}</a><br />
              &copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

const h1 = (text) =>
  `<h1 style="margin:0 0 12px;font-family:${FONT};font-size:24px;line-height:32px;font-weight:700;color:${BRAND.ink};letter-spacing:-0.3px;">${text}</h1>`;

const p = (text, extra = "") =>
  `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:24px;color:${BRAND.body};${extra}">${text}</p>`;

const note = (text) =>
  `<p style="margin:24px 0 0;padding-top:20px;border-top:1px solid ${BRAND.line};font-family:${FONT};font-size:13px;line-height:20px;color:${BRAND.muted};">${text}</p>`;

export const html = {
  // 1. Registration OTP
  registerOtp: ({ otp, userName, expiresInMinutes = 10 }) =>
    layout({
      title: "Verify your email",
      preheader: `Your ${BRAND.name} verification code is ${otp}`,
      content: `
        ${h1("Verify your email")}
        ${p(greeting(userName))}
        ${p(`Enter this code to finish creating your ${BRAND.name} account.`)}
        ${otpBoxes(otp)}
        ${p(`This code expires in <strong style="color:${BRAND.ink};">${expiresInMinutes} minutes</strong>.`, "text-align:center;")}
        ${note("Didn't sign up for Forge AI? You can ignore this email. No account will be created without this code. Never share this code with anyone.")}
      `,
    }),

  // 2. Resend OTP
  resendOtp: ({ otp, userName, expiresInMinutes = 10 }) =>
    layout({
      title: "Your new verification code",
      preheader: `Your new ${BRAND.name} verification code is ${otp}`,
      content: `
        ${h1("Your new verification code")}
        ${p(greeting(userName))}
        ${p("You asked for a new code. Use the one below. Any earlier code no longer works.")}
        ${otpBoxes(otp)}
        ${p(`This code expires in <strong style="color:${BRAND.ink};">${expiresInMinutes} minutes</strong>.`, "text-align:center;")}
        ${note("If you didn't request a new code, you can ignore this email. Never share this code with anyone.")}
      `,
    }),

  // 3. New login alert
  newLogin: ({
    userName,
    device,
    browser,
    location,
    ip,
    time,
    secureAccountLink,
  }) =>
    layout({
      title: "New login to your account",
      preheader: "We noticed a new login to your Forge AI account.",
      content: `
        ${h1("New login to your account")}
        ${p(greeting(userName))}
        ${p(`We noticed a new login to your ${BRAND.name} account. Here are the details:`)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;background:#F9FAFB;border-radius:10px;padding:4px 20px;">
          <tr><td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${detailRows([
        ["Time", time],
        ["Device", device],
        ["Browser", browser],
        ["Location", location],
        ["IP address", ip],
      ])}
            </table>
          </td></tr>
        </table>
        ${p("<strong style=\"color:" + BRAND.ink + ";\">Was this you?</strong> No action is needed. You can ignore this email.")}
        ${p("<strong style=\"color:" + BRAND.ink + ";\">Wasn't you?</strong> Someone else may have your password. Reset it now to secure your account and sign out other devices.")}
        `,
      // ${secureAccountLink ? button(secureAccountLink, "Secure my account") : ""}
    }),

  // 4. Welcome / onboarding (after Google login or successful registration)
  welcome: ({ userName, dashboardUrl = BRAND.appUrl }) =>
    layout({
      title: `Welcome to ${BRAND.name}`,
      preheader: "Your account is ready. Here's how to get started.",
      content: `
        ${h1(`Welcome to ${BRAND.name}${userName ? ", " + esc(userName) : ""}`)}
        ${p("Your account is ready. Describe what you want to build, and Forge AI writes the code in a live sandbox you can preview right away.")}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 4px;">
          ${[
          ["Start a project", "Describe your app in plain language and the agent builds it."],
          ["Preview instantly", "Every project runs in its own sandbox with a live preview URL."],
          ["Keep iterating", "Ask for changes and the agent edits your files in place."],
        ]
          .map(
            ([title, text], i, arr) => `
          <tr>
            <td style="padding:14px 0;${i < arr.length - 1 ? `border-bottom:1px solid ${BRAND.line};` : ""}font-family:${FONT};">
              <div style="font-size:15px;font-weight:600;color:${BRAND.ink};">${title}</div>
              <div style="font-size:14px;line-height:22px;color:${BRAND.body};padding-top:2px;">${text}</div>
            </td>
          </tr>`
          )
          .join("")}
        </table>
        ${button(dashboardUrl, "Open Forge AI")}
        ${note(`Questions? Reply to this email or write to <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.muted};">${BRAND.supportEmail}</a>.`)}
      `,
    }),

  // 5. Reset password (restyled version of your existing template)
  resetPassword: ({ resetPasswordLink, userName, expiresInMinutes = 10 }) =>
    layout({
      title: "Reset your password",
      preheader: "Use this link to choose a new password.",
      content: `
        ${h1("Reset your password")}
        ${p(greeting(userName))}
        ${p("We received a request to reset your password. Select the button below to choose a new one.")}
        ${button(resetPasswordLink, "Reset password")}
        ${p(`This link expires in <strong style="color:${BRAND.ink};">${expiresInMinutes} minutes</strong>.`, "margin-top:16px;")}
        ${note(`If the button doesn't work, copy this link into your browser:<br /><a href="${esc(resetPasswordLink)}" style="color:${BRAND.accent};word-break:break-all;">${esc(resetPasswordLink)}</a><br /><br />Didn't request this? You can ignore this email. Your password stays the same.`)}
      `,
    }),
};