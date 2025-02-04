import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4567;
const CLIENT_ID = process.env.VITE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.VITE_CLIENT_SECRET as string;

app.use(cors());
app.use(express.json());

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

  const github_res = await exchange_code(code) as globalThis.Response;

  console.log(github_res);

  if (!("access_token" in github_res)) {
    return res.status(400).send("Failed to get the exchange code for token");
  }

  const access_token = github_res.access_token as string;
  const user =  await user_info(access_token) as globalThis.Response;

  if (!("login" in user) || !("name" in user)) {
    return res.status(400).send("Failed to get user information");
  }

  res.send(`Got user info! Welcome ${user.name}, with username ${user.login}`);
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});