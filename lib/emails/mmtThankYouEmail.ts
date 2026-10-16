export const MMTThankYouEmail = ({
  firstName,
}: {
  firstName: string;
}) => {
  const name = firstName?.split(" ")[0] || "Subscriber";

  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Thank You for Subscribing</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0" style="padding:20px 0;background:#f4f4f4;">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 5px 25px rgba(0,0,0,0.1);">
          
          <!-- HEADER -->
          <tr>
            <td style="background:#004d73;padding:20px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;">
                Metrology
              </h1>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:30px 40px;text-align:left;">
              <p style="font-size:18px;color:#222;">
                Hi <strong>${name}</strong>,
              </p>

              <p style="font-size:16px;color:#333;line-height:1.6;">
                Thank you for subscribing to <strong>Metrology</strong>.
                You're now part of a community committed to innovation in Toolingdesign,
                machining, and tooling excellence.
              </p>

              <p style="font-size:16px;color:#333;margin-top:20px;">
                You’ll now receive:
              </p>

              <ul style="font-size:15px;color:#444;line-height:1.7;margin-top:10px;">
                <li>Latest industry news</li>
                <li>Expert insights and technical articles</li>
                <li>Event updates and webinars</li>
                <li>Design, machining & Tooling maintenance strategies</li>
              </ul>

              <div style="background:#004d73;color:white;margin:25px 0;padding:18px;border-radius:6px;text-align:center;font-size:17px;">
                <strong>Your subscription is confirmed!</strong>
              </div>

              <p style="font-size:15px;color:#555;line-height:1.6;">
                If you have any questions, feel free to reach us at:
                <br />
                <a href="mailto:info@toolingtechnology.com" style="color:#004d73;font-weight:bold;text-decoration:none;">
                  info@toolingtechnology.com
                </a>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#00344f;padding:20px;text-align:center;">
              <p style="color:white;margin:0;font-size:12px;">
                © 2025 Metrology. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
