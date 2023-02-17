const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 shutting down...");
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: `${__dirname}/config.env` });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.set("strictQuery", false);

mongoose
  .connect(DB, {})
  .then(() => console.log("Database connection established"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
