const getMailerConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    from
  };
};

const sendOtpEmail = async ({ to, otpCode, subject, label }) => {
  const config = getMailerConfig();

  if (!config) {
    console.log(`[OTP-DEV] ${label} OTP for ${to}: ${otpCode}`);
    return { delivered: false, mode: "dev-console" };
  }

  try {
    const nodemailerModule = await import("nodemailer");
    const nodemailer = nodemailerModule.default || nodemailerModule;
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth
    });

    await transporter.sendMail({
      from: config.from,
      to,
      subject,
      text: `Your OTP is ${otpCode}. It will expire in 10 minutes.`,
      html: `<p>Your OTP is <b>${otpCode}</b>.</p><p>It will expire in 10 minutes.</p>`
    });

    return { delivered: true, mode: "smtp" };
  } catch (error) {
    console.error("Failed to send OTP email:", error.message);
    return { delivered: false, mode: "send-failed" };
  }
};

export const sendRegisterOtpEmail = async ({ to, otpCode }) =>
  sendOtpEmail({
    to,
    otpCode,
    subject: "Student Portal Registration OTP",
    label: "Register"
  });

export const sendResetPasswordOtpEmail = async ({ to, otpCode }) =>
  sendOtpEmail({
    to,
    otpCode,
    subject: "Student Portal Password Reset OTP",
    label: "Reset Password"
  });
