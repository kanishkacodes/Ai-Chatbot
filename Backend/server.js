import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import authRoutes from "./routes/auth.js"; 
import passportConfig from "./config/passport.js";
import cors from "cors";
import chatRoutes from "./routes/chat.js";

dotenv.config();

// Connect to the database
connectDB();
passportConfig();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// Use the routes without /api
app.use("/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
