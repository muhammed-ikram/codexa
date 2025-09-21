const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (toEmail, name) => {
  try {
    await transporter.sendMail({
      from: `${process.env.EMAIL_USER}`,
      to: toEmail,
      subject: "🎉Welcome to CodeXA!",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Codex</title>
    <style>
        /* Basic styles for compatibility */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        /* Media Queries for responsiveness */
        @media screen and (max-width: 600px) {
            .mobile-hide { display: none !important; }
            .mobile-padding { padding: 10px 5% 10px 5% !important; }
            .mobile-full-width { max-width: 100% !important; }
        }
    </style>
</head>
<body style="background-color: #111827; margin: 0 !important; padding: 0 !important;">

    <!-- Main Table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 20px;">
                <!-- Content Wrapper -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    
                    <!-- LOGO -->
                    <tr>
                        <td align="center" style="padding: 40px 0 30px 0;">
                           <h1 style="font-family: Arial, sans-serif; color: #FFFFFF; font-size: 32px; font-weight: bold; margin: 0;">CodeXA</h1>
                           <p style="font-family: Arial, sans-serif; color: #9CA3AF; font-size: 14px; margin: 5px 0 0 0;">Your AI Project Mentor</p>
                        </td>
                    </tr>

                    <!-- MAIN CONTENT -->
                    <tr>
                        <td bgcolor="#1F2937" align="center" style="padding: 40px 30px 40px 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <!-- HEADING -->
                                <tr>
                                    <td align="center" style="font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #FFFFFF;">
                                        Thank You for Registering!
                                    </td>
                                </tr>
                                <!-- SUBTEXT -->
                                <tr>
                                    <td align="center" style="padding: 20px 0 30px 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #D1D5DB;">
                                        Hi ${name}, <br><br>
                                        Welcome to Codex! We're thrilled to have you here. Your journey to build the next amazing project is just a click away.
                                    </td>
                                </tr>
                                <!-- CALL TO ACTION BUTTON -->
                                <tr>
                                    <td align="center">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="border-radius: 6px;" bgcolor="#4F46E5">
                                                    <a href="[Your Website URL]" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 6px; padding: 15px 25px; border: 1px solid #4F46E5; display: inline-block; font-weight: bold;">Go to Your Dashboard</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- A little feature reminder -->
                                 <tr>
                                    <td align="center" style="padding: 40px 0 0 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #9CA3AF;">
                                        Ready to get started? Why not try one of our popular features:
                                        <br>
                                        <strong>AI Project Architect &bull; AI Launch Advisor &bull; Career Hub</strong>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- FOOTER -->
                    <tr>
                        <td align="center" style="padding: 30px 10px 0 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" style="padding: 0 10px 10px 10px; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #6B7280;">
                                        <p style="margin: 0;">You received this email because you logged into your Codex account. If you didn't do this, please secure your account immediately.</p>
                                    </td>
                                </tr>
                                <tr>
                                     <td align="center" style="font-family: Arial, sans-serif; font-size: 12px; color: #6B7280;">
                                        &copy; 2024 Codex. All Rights Reserved.
                                     </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>`,
    });
    console.log("✅ Welcome email sent to", toEmail);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

module.exports = sendWelcomeEmail;