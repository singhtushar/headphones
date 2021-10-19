require("dotenv").config();
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const Customer = require("./Database/model");

const PORT = process.env.PORT || 8000;

const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://singhtushar:${process.env.DB_PASSWORD}@registerapi.fgpov.mongodb.net/kart`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: true,
      // useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((error) => {
    console.log("error occured in database");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.post("/register", async (req, res) => {
  const { email, color } = req.body;
  console.log(email);
  console.log(color);

  Customer.find().exec((err, user) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: `${process.env.EMAIL_ID}`,
        pass: `${process.env.PASSWORD}`,
      },
    });
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take messages");
      }
    });
    if (user) {
      const pid = user.length + 1;
      Customer.findOne({ email }).exec(async (err, user) => {
        if (user) {
          user.color = color;
          await user.save(async (err) => {
            if (err) {
              return res.json({
                error: "problem while saving data to database",
              });
            } else {
              const mailOptions = {
                from: `${process.env.EMAIL_ID}`,
                to: `${email}`,
                subject: "Beats Headphone",
                html: `<h2>Your request for Beats Headphone colored ${color} is successfully updated</h2>
                    <p style="color: red">Customer ID:  <strong>${user.pid}</strong></p>`,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                  console.log(
                    "error while sending the mail check controller/auth"
                  );
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
              console.log("data updated");
            }
          });
        } else {
          let user = new Customer({ color, email, pid });
          await user.save((err, success) => {
            if (err) {
              console.log("error occured in while creating new user.");
              return res.status(400).json({ error: err });
            } else {
              const mailOptions = {
                from: `${process.env.EMAIL_ID}`,
                to: `${email}`,
                subject: "Beats Headphone",
                html: `<h2>Dear customer, Your request for Beats Headphones colored ${color} is successfull</h2>
                    <p>Registration no. <strong>${user.pid}</strong></p>`,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                  console.log(
                    "error while sending the mail check controller/auth"
                  );
                } else {
                  console.log("Email sent: " + info.response);
                }
              });

              console.log("successfully created the user");
              return res.status(200).json({ user });
            }
          });
        }
      });
    }
  });
  res.redirect("index.html");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
