import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (username, useremail) => {
  console.log("Entered In The Send Email Function");
  // Initialize mailgen instance with default theme and brand configuration
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanager.app",
    },
  });

  console.log("MailGen Instance Created");
  const emailVerificationMailgenContent = (name) => {
    return {
      body: {
        name: name,
        intro: "Welcome to our app! We're very excited to have you on board.",
        action: {
          instructions:
            "To verify your email please click on the following button:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Verify your email",
            link: "https://github.com/YashPandey1405",
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
  };

  console.log("MailGen Plaintext-Content Created");
  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailTextual = mailGenerator.generatePlaintext(
    emailVerificationMailgenContent(username)
  );

  console.log("MailGen HTML-Content Created");
  // Generate an HTML email with the provided contents
  const emailHtml = mailGenerator.generate(
    emailVerificationMailgenContent(username)
  );

  console.log("NodeMailer Setup Started");
  // Create a nodemailer transporter instance which is responsible to send a mail
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST, // MailTrap-SMTP host
    port: process.env.MAILTRAP_SMTP_PORT, // SMTP port
    auth: {
      user: process.env.MAILTRAP_SMTP_USER, // SMTP username
      pass: process.env.MAILTRAP_SMTP_PASS, // SMTP password
    },
  });

  console.log("The Above MailGen Content is Ready to be sent using NodeMailer");
  // The Actual mail object that will be sent to the user....
  const mail = {
    from: "mail.taskmanager@example.com", // We can name this anything. The mail will go to your Mailtrap inbox
    to: useremail, // receiver's mail
    subject: "Practice Of Mailing Using NodeMailer+Mailtrap Along With Mailgen", // mail subject
    text: emailTextual, // mailgen content textual variant --> for clients that do not support HTML....
    html: emailHtml, // mailgen content html variant --> for clients that support HTML....
  };

  try {
    console.log("Woohoo , Mail is Sent Successfully");
    // Send the mail using the transporter instance.....
    await transporter.sendMail(mail);
  } catch (error) {
    // As sending email is not strongly coupled to the business logic it is not worth to raise an error when email sending fails
    // So it's better to fail silently rather than breaking the app
    console.error(
      "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file"
    );
    console.error("Error: ", error);
  }
};

export { sendEmail };
