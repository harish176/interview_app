// require("dotenv").config();
// const express=require("express")
// const cors=require("cors")
// const path=require("path")
// const connectDB=require("./config/db")

// const authRoutes = require('./routes/authRoutes');
// const sessionRoutes = require('./routes/sessionRoutes');
// const questionRoutes = require('./routes/questionRoutes');
// const {protect} = require('./middlewares/authMiddleware')
// const {generateInterviewQuestions, generateConceptExplanation} =require('./controllers/aiController');

// const app=express();

// app.use(
//     cors({
//         origin:"*",
//         methods:["GET","POST","PUT","DELETE"],
//         allowedHeaders:["content-type","Authorization"],
//     })
// );

// connectDB();

// //Middleware
// app.use(express.json());


// // Routes
// app.use("/api/auth",authRoutes);
// app.use("/api/sessions",sessionRoutes);
// app.use("/api/questions",questionRoutes);

// app.use("/api/ai/generate-questions",protect,generateInterviewQuestions);
// app.use("/api/ai/generate-explanation",protect,generateConceptExplanation);


// app.use("/uploads",express.static(path.join(__dirname,"uploads"),{}));



// const PORT=process.env.PORT || 5000;
// app.listen(PORT,()=>console.log(`server running on port${PORT}`));

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const questionRoutes = require('./routes/questionRoutes');
const { protect } = require('./middlewares/authMiddleware');
const {
  generateInterviewQuestions,
  generateConceptExplanation
} = require('./controllers/aiController');

const app = express();

// ======== MIDDLEWARE ========
app.use(express.json());

// === CORS SETUP ===
// Use frontend domain in production
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ======== CONNECT DB ========
connectDB();

// ======== API ROUTES ========
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);

// ======== UPLOAD STATIC FILES ========
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======== DEPLOY FRONTEND STATIC FILES (optional) ========
// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "frontend/interview-prep-ai/dist")));
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "interview-prep-ai", "dist", "index.html"))
//   );
// }

// ======== START SERVER ========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
