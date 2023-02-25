const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitization = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);

const app = express();

// 1) Global Middlewares
// Set security HTTP headers
app.use(helmet());

// Develpoment log in
// Show working details
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  // From an ip 1000 request per hour
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this ip, please try again in an hour",
});

app.use("/api", limiter);

// Parsing json request body, reading data from body to req.body
// Limit body size
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitization());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Set static file directory
// Can load files in /public. For example http://localhost:3000/overview.html
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTE HANDLES

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// 3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} in this server`, 404));
});

// 4) ERRORS HANDLING
app.use(globalErrorHandler);

module.exports = app;
