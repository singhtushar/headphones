const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    pid: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Customer = mongoose.model("customer", userSchema);
