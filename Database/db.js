require("dotenv").config();
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
