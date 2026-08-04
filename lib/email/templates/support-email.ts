function shell(heading: string, rows: string): string {
  return `
    <div style="background:#F8FAFC;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:#2563EB;color:#fff;font-weight:800;font-size:14px;">G</span>
          <span style="font-size:18px;font-weight:800;color:#0F172A;">Grad<span style="color:#2563EB;">Seal</span></span>
        </div>
        <h1 style="font-size:20px;color:#0F172A;margin:0 0 20px;">${heading}</h1>
        <table role="presentation" style="width:100%;border-collapse:collapse;">
          ${rows}
        </table>
      </div>
    </div>
  `;
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0;font-size:12px;color:#94A3B8;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;font-size:14px;color:#0F172A;line-height:1.6;">${value}</td>
    </tr>
  `;
}

interface SupportRequestEmailParams {
  studentName: string;
  studentEmail: string;
  subject: string;
  orderId?: string | null;
  message: string;
}

export function supportRequestEmail({
  studentName,
  studentEmail,
  subject,
  orderId,
  message,
}: SupportRequestEmailParams): { subject: string; html: string } {
  const rows = [
    row("Student", studentName),
    row("Email", studentEmail),
    orderId ? row("Order ID", orderId) : "",
    row("Subject", subject),
    row("Message", message.replace(/\n/g, "<br/>")),
  ].join("");

  return {
    subject: `New support request: ${subject}`,
    html: shell("New support request", rows),
  };
}

export function supportConfirmationEmail({ firstName }: { firstName: string }): {
  subject: string;
  html: string;
} {
  return {
    subject: "We've received your message — GradSeal",
    html: shell(
      "Thanks for reaching out!",
      `<tr><td style="padding:8px 0;font-size:14px;color:#64748B;line-height:1.7;">
        Hi ${firstName}, thanks for contacting GradSeal support. Our team typically
        responds within 24 hours.
      </td></tr>`
    ),
  };
}
