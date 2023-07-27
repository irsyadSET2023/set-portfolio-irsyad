// console.log("Hello Mars");
const nodemailer = require("nodemailer");
const express = require("express");
const path = require("node:path");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const pdfFilePath = path.join(
  __dirname,
  "data/Muhammad_Irsyad_Murtadha_Resume.pdf"
);

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // console.log(req.hostname);
  //   console.log(path);
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/contact", (req, res) => {
  // get form data
  const formData = req.body;

  // create new transport object
  let transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "73c45dea7c51ec",
      pass: "9283935c45f812",
    },
  });

  // create async function for sending email
  async function sendEmail() {
    // send mail with defined transport object
    const info = await transport.sendMail({
      from: "irsyad493@gmail.com", // sender address
      to: formData.email, // list of receivers
      subject: `Welcome ${formData.name}`, // Subject line
      text: JSON.stringify(formData), // plain text body
      html: `<p>${JSON.stringify(formData)}</p>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
  }

  sendEmail()
    .then(function () {
      res.redirect("/thank-you");
    })
    .catch(function () {
      res.redirect("/error");
    });
});

app.get("/thank-you", (req, res) => {
  res.sendFile(path.join(__dirname, "views/thank-you.html"));
  // res.send("Thank You");
});

app.get("/error", (req, res) => {
  res.send("Oh no Error Happen");
});

app.get("/download_cv", function (req, res) {
  try {
    // Set the filename for the downloaded file
    const filename = "Irsyad_Resume.pdf";

    // Send the PDF file as a response to initiate the download
    res.download(pdfFilePath, filename, function (err) {
      if (err) {
        // Handle the error appropriately (e.g., sending an error response)
        console.error("Error downloading the CV:", err);
        res.status(500).send("Error downloading the CV.");
      }
    });
  } catch (error) {
    console.error("Error serving the CV:", error);
    // Handle the error appropriately (e.g., sending an error response)
    res.status(500).send("Error serving the CV.");
  }
});

app.get("/*", function (req, res) {
  res.send("404 Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
