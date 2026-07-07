interface OtpEmailParams {
  firstName: string;
  otp: string;
  expiryMinutes: number;
}

function otpDigitsTable(otp: string): string {
  return otp
    .split("")
    .map(
      (d) =>
        `<td style="width:40px;height:48px;background:#F1F5F9;border-radius:8px;text-align:center;vertical-align:middle;font-size:22px;font-weight:700;color:#0F172A;font-family:monospace;">${d}</td>`
    )
    .join(`<td style="width:8px;"></td>`);
}

function otpEmailShell(heading: string, body: string, digits: string): string {
  return `
    <div style="background:#F8FAFC;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:480px;margin:0 auto;background:#FFFFFF;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:#2563EB;color:#fff;font-weight:800;font-size:14px;">G</span>
          <span style="font-size:18px;font-weight:800;color:#0F172A;">Grad<span style="color:#2563EB;">Seal</span></span>
        </div>
        <h1 style="font-size:20px;color:#0F172A;margin:0 0 12px;">${heading}</h1>
        <p style="font-size:14px;color:#64748B;line-height:1.6;margin:0 0 24px;">${body}</p>
        <table role="presentation" style="margin:0 auto 24px;border-collapse:separate;">
          <tr>${digits}</tr>
        </table>
        <p style="font-size:12px;color:#94A3B8;line-height:1.6;margin:0;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;
}

export function otpEmailTemplate({
  firstName,
  otp,
  expiryMinutes,
}: OtpEmailParams): { subject: string; html: string } {
  return {
    subject: `Your GradSeal verification code: ${otp}`,
    html: otpEmailShell(
      "Verify your email",
      `Hi ${firstName}, use the code below to verify your email address and activate your GradSeal account. This code expires in ${expiryMinutes} minutes.`,
      otpDigitsTable(otp)
    ),
  };
}

export function loginOtpEmailTemplate({
  firstName,
  otp,
  expiryMinutes,
}: OtpEmailParams): { subject: string; html: string } {
  return {
    subject: `Your GradSeal sign-in code: ${otp}`,
    html: otpEmailShell(
      "Confirm your sign-in",
      `Hi ${firstName}, someone is trying to sign in to your GradSeal account. Enter the code below to complete sign-in. This code expires in ${expiryMinutes} minutes. If this wasn't you, we recommend changing your password.`,
      otpDigitsTable(otp)
    ),
  };
}
