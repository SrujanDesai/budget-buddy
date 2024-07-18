// Importing Packages
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDb = require("./config/connectDb");
const userRoute = require("./routes/userRoute");
const expenseRoute = require("./routes/ExpenseRoute");
const AccountRoute = require("./routes/AccountRoute");

// Configuring dot env file
dotenv.config();

// MongoDB Connection
connectDb();

// REST Object
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Routes
// USER
app.use("/api/v1/auth", userRoute);
// EXPENSE
app.use("/api/v1/expense", expenseRoute);
// ACCOUNT
app.use("/api/v1/account", AccountRoute);

// Homepage Route for Backend
app.get("/", (req, res) => {
  res.send(`<h1>Hello from Server</h1>`);
});

// Port
const PORT = 8080 || process.env.PORT;

// Listening Server
app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
