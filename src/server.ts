import express, { Request, Response } from "express";
import cookie_parser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4567;
const CLIENT_ID = process.env.VITE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.VITE_CLIENT_SECRET as string;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

type GithubUserInfoResponse = {
  id?: number,
  name?: string,
  login?: string
};

type GithubAuthResponse = {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope: string;
  token_type: "bearer";
};

function exchange_code(code: string): Promise<any> {
  const params = new URLSearchParams({
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "code": code
  });

  const res = fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  })
  .then(response => response.json())
  .catch(error => console.error("Error: ", error));
  
  return res;
}

async function user_info(token: string): Promise<any> {
  const res = await fetch("https://api.github.com/user", {
    method: "GET",
    headers:{
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .catch(error => console.error("Error: ", error));

  return res
}

app.get("/github/callback", async (req: Request, res:Response) => {
  const code = req.query.code as string | undefined;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  const github_auth = await exchange_code(code) as GithubAuthResponse;
  console.log("grabbed github auth");

  if (!github_auth.access_token
    || !github_auth.expires_in
    || !github_auth.refresh_token
    || !github_auth.refresh_token_expires_in) {
    return res.status(400).send("Failed to get the exchange code for token");
  }

  res.cookie("refresh_token", github_auth.refresh_token, {
    maxAge: github_auth.refresh_token_expires_in * 1000,
  });

  // const user =  await user_info(access_token) as GithubUserInfoResponse;

  // if (!user.id || !user.login || !user.name) {
  //   return res.status(400).send("Failed to get user information");
  // }

  console.log("succ");
  return res.status(200).send();
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});