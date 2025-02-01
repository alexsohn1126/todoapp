import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4567;

// Middleware
app.use(cors());
app.use(express.json());

// OAuth Callback Route
app.get("/github/callback", (req, res) => {
  const code = req.query.code as string | undefined;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  res.send(`Received OAuth code: ${code}`);
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});