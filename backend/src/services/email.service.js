const nodemailer = require('nodemailer');
const config = require('../config/env');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.initTransporter();
  }

  initTransporter() {
    if (!config.smtpUser && !config.smtpPass) {
      console.log('[EmailService] SMTP credentials not fully configured in .env. Real email delivery will be simulated or skipped.');
      return;
    }

    try {
      const transportOptions = {
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpSecure,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass
        }
      };

      if (config.smtpService) {
        transportOptions.service = config.smtpService;
      }

      this.transporter = nodemailer.createTransport(transportOptions);
      this.initialized = true;
      console.log(`[EmailService] Nodemailer transporter configured for host: ${config.smtpHost || config.smtpService || 'custom'}`);
    } catch (err) {
      console.error('[EmailService Error] Failed to initialize Nodemailer transporter:', err.message);
    }
  }

  getTransporter() {
    if (!this.transporter && (config.smtpUser || config.smtpPass)) {
      this.initTransporter();
    }
    return this.transporter;
  }

  // ── Helper: Info table row ────────────────────────────────────────────────
  infoRow(label, value, valueExtraStyle = '') {
    return `
      <tr>
        <td style="color:#94a3b8;font-size:13px;padding:10px 12px 10px 0;border-bottom:1px solid #334155;width:42%;vertical-align:top;">${label}</td>
        <td style="color:#f8fafc;font-weight:600;font-size:13px;padding:10px 0 10px 12px;border-bottom:1px solid #334155;text-align:right;vertical-align:top;word-break:break-word;${valueExtraStyle}">${value}</td>
      </tr>
    `;
  }

  // ── Helper: Info card table ───────────────────────────────────────────────
  infoCard(rows, accentColor) {
    const color = accentColor || '#d4af37';
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
        style="background-color:#1e293b;border-left:3px solid ${color};border-radius:6px;overflow:hidden;margin:22px 0;">
        <tr><td style="padding:4px 18px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${rows}
          </table>
        </td></tr>
      </table>
    `;
  }

  // ── Helper: CTA Button ────────────────────────────────────────────────────
  ctaButton(href, text, gradient, textColor) {
    const bg = gradient || 'linear-gradient(135deg,#d4af37 0%,#b89326 100%)';
    const tc = textColor || '#000000';
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:20px 0 4px 0;">
        <tr>
          <td align="center">
            <!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
              href="${href}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="10%" fillcolor="#d4af37">
              <w:anchorlock/>
              <center style="color:${tc};font-family:sans-serif;font-size:14px;font-weight:700;">${text}</center>
            </v:roundrect>
            <![endif]-->
            <!--[if !mso]><!-->
            <a href="${href}"
              style="display:inline-block;padding:14px 36px;background:${bg};color:${tc} !important;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;border-radius:6px;box-shadow:0 4px 15px rgba(212,175,55,0.35);mso-hide:all;">
              ${text}
            </a>
            <!--<![endif]-->
          </td>
        </tr>
      </table>
    `;
  }

  // ── Helper: Badge ─────────────────────────────────────────────────────────
  badge(text, bgColor, borderColor, textColor) {
    const bg = bgColor || 'rgba(212,175,55,0.15)';
    const bc = borderColor || '#d4af37';
    const tc = textColor || '#f3ba2f';
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px 0;">
        <tr>
          <td style="display:inline-block;padding:6px 16px;background-color:${bg};border:1px solid ${bc};color:${tc};border-radius:20px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
            ${text}
          </td>
        </tr>
      </table>
    `;
  }

  // ── Responsive Email Layout Wrapper ──────────────────────────────────────
  wrapTemplate({ title, preheader, contentHtml }) {
    return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style type="text/css">
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;}
    img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}
    body{margin:0!important;padding:0!important;width:100%!important;background-color:#0b0f19;}

    @media only screen and (max-width:620px){
      .email-container{width:100%!important;max-width:100%!important;}
      .email-header{padding:24px 16px!important;}
      .email-body{padding:24px 16px!important;}
      .email-footer{padding:16px 14px!important;}
      .brand-title{font-size:20px!important;letter-spacing:2px!important;}
      .email-heading{font-size:19px!important;}
      .cta-link{display:block!important;width:auto!important;text-align:center!important;padding:14px 20px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0b0f19;width:100%;">

  <!-- Preheader -->
  <div style="display:none;font-size:1px;color:#0b0f19;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${preheader || title}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0b0f19;">
    <tr>
      <td align="center" style="padding:40px 10px;">

        <!-- Email container -->
        <table class="email-container" role="presentation" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;background-color:#111827;border:1px solid #2d3748;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);">

          <!-- Header -->
          <tr>
            <td class="email-header" align="center"
              style="background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);padding:32px 30px;border-bottom:2px solid #d4af37;">
              <p class="brand-title"
                style="margin:0;font-size:26px;font-weight:800;letter-spacing:4px;color:#ffffff;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                AUTO<span style="color:#d4af37;">LUXE</span>
              </p>
              <p style="margin:6px 0 0 0;font-size:11px;letter-spacing:2px;color:#94a3b8;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Excellence in Luxury Automotive
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="email-body"
              style="padding:36px 30px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#e2e8f0;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="email-footer" align="center"
              style="background-color:#0a0e17;padding:22px 30px;border-top:1px solid #1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#64748b;line-height:1.6;">
              <p style="margin:0 0 6px 0;"><strong>AutoLuxe Private Showroom &amp; Concierge</strong></p>
              <p style="margin:0 0 6px 0;">This email was sent from your AutoLuxe luxury dealership management platform.</p>
              <p style="margin:0;">&copy; ${new Date().getFullYear()} AutoLuxe Motors. All rights reserved.</p>
            </td>
          </tr>

        </table>
        <!-- /Email container -->

      </td>
    </tr>
  </table>

</body>
</html>
    `;
  }

  // ── Generic Send Method ───────────────────────────────────────────────────
  async sendMail({ to, subject, html, text }) {
    const transporter = this.getTransporter();

    if (!transporter) {
      console.log(`[Email Service Notice] SMTP not configured. Email preview:`);
      console.log(`  To: ${to}`);
      console.log(`  Subject: ${subject}`);
      return { status: 'simulated', to, subject };
    }

    const mailOptions = {
      from: config.emailFrom || `"AutoLuxe Concierge" <${config.smtpUser}>`,
      to,
      subject,
      html,
      text
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Delivered Successfully] ID: ${info.messageId} | Sent to: ${to} | Subject: "${subject}"`);
      return { status: 'sent', messageId: info.messageId, to };
    } catch (err) {
      console.error(`[Email Delivery Error] Failed to send email to ${to}:`, err.message);
      throw err;
    }
  }

  // ── 1. Welcome Email Sent to Customer upon Registration ───────────────────
  async sendWelcomeEmail(data) {
    const { email, name } = data;
    const clientUrl = config.clientUrl || 'http://localhost:5173';

    const rows =
      this.infoRow('Member Name', name || 'Member') +
      this.infoRow('Account Email', email) +
      this.infoRow('VIP Services', 'Test Drives &bull; Reservations &bull; Concierge');

    const contentHtml = `
      ${this.badge('Welcome to the Fleet')}
      <h2 class="email-heading" style="color:#ffffff;margin:0 0 14px 0;font-size:22px;line-height:1.3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        Welcome to AutoLuxe, ${name || 'Valued Customer'}
      </h2>
      <p style="color:#cbd5e1;margin:0 0 6px 0;font-size:15px;line-height:1.7;">
        Thank you for joining <strong>AutoLuxe</strong>. Your member account is now active, granting you instant access to our exclusive catalog of certified exotic, prestige, and luxury sports vehicles.
      </p>
      ${this.infoCard(rows)}
      <p style="color:#cbd5e1;font-size:14px;margin:0 0 4px 0;line-height:1.6;">
        Browse the latest high-performance arrivals or schedule a private test drive at your convenience:
      </p>
      ${this.ctaButton(clientUrl + '/', 'Explore Showroom')}
    `;

    const html = this.wrapTemplate({
      title: 'Welcome to AutoLuxe',
      preheader: `Welcome ${name || ''} to AutoLuxe — Your gateway to elite automotive excellence.`,
      contentHtml
    });

    const text = `Welcome to AutoLuxe, ${name || 'Customer'}!\n\nYour account (${email}) has been successfully created. Explore our luxury vehicle inventory at ${clientUrl}/inventory.`;

    return this.sendMail({
      to: email,
      subject: '✨ Welcome to AutoLuxe - Exclusive Luxury Mobility',
      html,
      text
    });
  }

  // ── 2. Admin Alert Email when a New Customer Registers ────────────────────
  async sendAdminNewCustomerAlert(data) {
    const { customerName, customerEmail, customerPhone, registeredAt } = data;
    const adminRecipient = config.adminEmail;

    if (!adminRecipient) {
      console.warn('[EmailService Warning] ADMIN_EMAIL not defined in .env. Admin registration alert skipped.');
      return null;
    }

    const clientUrl = config.clientUrl || 'http://localhost:5173';
    const formattedDate = new Date(registeredAt || Date.now()).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const rows =
      this.infoRow('Customer Name', customerName || 'N/A', 'color:#ffffff;') +
      this.infoRow('Email Address', customerEmail, 'color:#60a5fa;') +
      this.infoRow('Phone Contact', customerPhone || 'Not provided') +
      this.infoRow('Registration Time', formattedDate);

    const contentHtml = `
      ${this.badge('Admin Management Alert', 'rgba(59,130,246,0.15)', '#3b82f6', '#60a5fa')}
      <h2 class="email-heading" style="color:#ffffff;margin:0 0 14px 0;font-size:22px;line-height:1.3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        New Customer Registered
      </h2>
      <p style="color:#cbd5e1;margin:0 0 6px 0;font-size:15px;line-height:1.7;">
        A new customer has successfully created an account on the AutoLuxe platform. Customer profile details are shown below:
      </p>
      ${this.infoCard(rows, '#3b82f6')}
      ${this.ctaButton(
        clientUrl + '/admin/customers',
        'View Customer in Admin Portal',
        'linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)',
        '#ffffff'
      )}
    `;

    const html = this.wrapTemplate({
      title: 'New Customer Registered - AutoLuxe Admin',
      preheader: `New customer registration: ${customerName} (${customerEmail})`,
      contentHtml
    });

    const text = `New Customer Registered on AutoLuxe!\n\nName: ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone || 'N/A'}\nTime: ${formattedDate}`;

    return this.sendMail({
      to: adminRecipient,
      subject: `🚗 [Admin Alert] New Customer Registered: ${customerName || customerEmail}`,
      html,
      text
    });
  }

  // ── 3. Login Confirmation Email Sent to Customer ──────────────────────────
  async sendLoginNotificationEmail(data) {
    const { email, name, loginTime } = data;
    const clientUrl = config.clientUrl || 'http://localhost:5173';
    const formattedTime = new Date(loginTime || Date.now()).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const rows =
      this.infoRow('Account Email', email) +
      this.infoRow('Timestamp', formattedTime) +
      this.infoRow('Status', '<span style="color:#34d399;">Active Session Authorized</span>');

    const contentHtml = `
      ${this.badge('Security &amp; Activity Notice', 'rgba(16,185,129,0.15)', '#10b981', '#34d399')}
      <h2 class="email-heading" style="color:#ffffff;margin:0 0 14px 0;font-size:22px;line-height:1.3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        Successful Login to AutoLuxe
      </h2>
      <p style="color:#cbd5e1;margin:0 0 6px 0;font-size:15px;line-height:1.7;">
        Hello <strong>${name || 'Valued Customer'}</strong>, your AutoLuxe account was just accessed successfully.
      </p>
      ${this.infoCard(rows, '#10b981')}
      <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0 0 20px 0;">
        If you performed this login, you can safely disregard this email. If you did not authorize this activity, please reset your password immediately or contact our concierge support.
      </p>
      ${this.ctaButton(clientUrl + '/inventory', 'Browse Luxury Vehicles')}
    `;

    const html = this.wrapTemplate({
      title: 'Successful Login Notice - AutoLuxe',
      preheader: `Login confirmation for your AutoLuxe account on ${formattedTime}`,
      contentHtml
    });

    const text = `Hello ${name || 'Customer'},\n\nYou have successfully logged in to AutoLuxe at ${formattedTime}.\nIf this wasn't you, please contact support immediately.\n\nAutoLuxe Team`;

    return this.sendMail({
      to: email,
      subject: '🔐 Successful Login to Your AutoLuxe Account',
      html,
      text
    });
  }

  // ── 4. Test Drive Confirmation ────────────────────────────────────────────
  async sendTestDriveConfirmation(data) {
    const { email, name, carTitle, preferredDate, preferredTime } = data;
    const formattedDate = preferredDate ? new Date(preferredDate).toLocaleDateString('en-US', { dateStyle: 'full' }) : 'Scheduled';

    const rows =
      this.infoRow('Vehicle', carTitle || 'AutoLuxe Fleet Vehicle', 'color:#d4af37;') +
      this.infoRow('Date', formattedDate) +
      this.infoRow('Time', preferredTime || 'As Arranged');

    const contentHtml = `
      ${this.badge('Test Drive Booked')}
      <h2 class="email-heading" style="color:#ffffff;margin:0 0 14px 0;font-size:22px;line-height:1.3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        Test Drive Reservation Confirmed
      </h2>
      <p style="color:#cbd5e1;margin:0 0 6px 0;font-size:15px;line-height:1.7;">
        Hello <strong>${name || 'Customer'}</strong>, your private test drive request for the <strong>${carTitle || 'luxury vehicle'}</strong> has been received and scheduled.
      </p>
      ${this.infoCard(rows)}
    `;

    const html = this.wrapTemplate({
      title: 'Test Drive Confirmed - AutoLuxe',
      preheader: `Your test drive for ${carTitle} is scheduled for ${formattedDate}`,
      contentHtml
    });

    return this.sendMail({
      to: email,
      subject: `🏎️ Test Drive Scheduled: ${carTitle || 'Luxury Vehicle'} - AutoLuxe`,
      html,
      text: `Your test drive for ${carTitle} has been confirmed for ${formattedDate} at ${preferredTime}.`
    });
  }

  // ── 5. Inquiry Received Email ─────────────────────────────────────────────
  async sendInquiryReceivedEmail(data) {
    const { email, name, carTitle } = data;

    const contentHtml = `
      ${this.badge('Inquiry Received')}
      <h2 class="email-heading" style="color:#ffffff;margin:0 0 14px 0;font-size:22px;line-height:1.3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        We've Received Your Inquiry
      </h2>
      <p style="color:#cbd5e1;margin:0 0 20px 0;font-size:15px;line-height:1.7;">
        Hello <strong>${name || 'Customer'}</strong>, thank you for reaching out regarding the <strong>${carTitle || 'vehicle'}</strong>. An AutoLuxe sales concierge is reviewing your request and will respond shortly.
      </p>
    `;

    const html = this.wrapTemplate({
      title: 'Inquiry Received - AutoLuxe',
      preheader: `Thank you for your inquiry on ${carTitle}`,
      contentHtml
    });

    return this.sendMail({
      to: email,
      subject: `💬 Inquiry Received: ${carTitle || 'AutoLuxe Vehicle'}`,
      html,
      text: `Hello ${name}, we have received your inquiry regarding ${carTitle}. Our concierge team will reach out soon.`
    });
  }

  // ── 6. Vehicle Reservation Confirmation ──────────────────────────────────
  async sendReservationConfirmation(data) {
    const { email, name, carTitle, startDate, endDate } = data;
    const startStr = startDate ? new Date(startDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'N/A';
    const endStr = endDate ? new Date(endDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'N/A';

    const rows =
      this.infoRow('Vehicle', carTitle || 'Luxury Vehicle', 'color:#d4af37;') +
      this.infoRow('Reservation Period', `${startStr} &ndash; ${endStr}`);

    const contentHtml = `
      ${this.badge('Reservation Placed')}
      <h2 class="email-heading" style="color:#ffffff;margin:0 0 14px 0;font-size:22px;line-height:1.3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        Vehicle Reservation Confirmed
      </h2>
      <p style="color:#cbd5e1;margin:0 0 6px 0;font-size:15px;line-height:1.7;">
        Hello <strong>${name || 'Customer'}</strong>, your reservation for the <strong>${carTitle || 'luxury vehicle'}</strong> has been created.
      </p>
      ${this.infoCard(rows)}
    `;

    const html = this.wrapTemplate({
      title: 'Reservation Confirmed - AutoLuxe',
      preheader: `Your reservation for ${carTitle} has been confirmed.`,
      contentHtml
    });

    return this.sendMail({
      to: email,
      subject: `🚗 Reservation Confirmed: ${carTitle || 'Luxury Vehicle'} - AutoLuxe`,
      html,
      text: `Hello ${name}, your reservation for ${carTitle} from ${startStr} to ${endStr} has been confirmed.`
    });
  }

  // ── Fallback Dispatcher for Direct Execution (When Redis is offline) ──────
  async processDirectEmail(jobName, data) {
    try {
      switch (jobName) {
        case 'sendWelcomeEmail':
          return await this.sendWelcomeEmail(data);
        case 'sendAdminNewCustomerAlert':
          return await this.sendAdminNewCustomerAlert(data);
        case 'sendLoginNotificationEmail':
          return await this.sendLoginNotificationEmail(data);
        case 'sendTestDriveConfirmation':
          return await this.sendTestDriveConfirmation(data);
        case 'sendInquiryReceivedEmail':
          return await this.sendInquiryReceivedEmail(data);
        case 'sendReservationConfirmation':
          return await this.sendReservationConfirmation(data);
        default:
          console.log(`[EmailService] Unhandled direct job: ${jobName}`);
          return null;
      }
    } catch (err) {
      console.error(`[EmailService Direct Processing Error for ${jobName}]:`, err.message);
    }
  }
}

module.exports = new EmailService();
