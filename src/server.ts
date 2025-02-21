import express, { Request, Response } from "express";
import cookie_parser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { CookieOptions } from "react-router";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4567;
const CLIENT_ID = process.env.VITE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.VITE_CLIENT_SECRET as string;

const cookie_settings = function (expiry_time: number): CookieOptions {
  return {
    maxAge: expiry_time * 1000,
    // TODO: Change this domain to an env var
    domain: "localhost",
    httpOnly: true,
    secure: true,
  } as CookieOptions;
};

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookie_parser());

type GithubAuthResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: "bearer";
};

function isGithubAuthResponse(data: any): data is GithubAuthResponse {
  return (
    typeof data.access_token === "string" &&
    typeof data.expires_in === "number" &&
    typeof data.refresh_token === "string" &&
    typeof data.refresh_token_expires_in === "number" &&
    typeof data.scope === "string" &&
    data.token_type === "bearer"
  );
}

async function fetch_token(
  params: URLSearchParams
): Promise<GithubAuthResponse> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  }).then((res) => res);

  if (!res.ok) throw new Error("Github OAuth Failed");

  const res_json = await res.json();
  console.log(res_json);
  if (isGithubAuthResponse(res_json)) return res_json;

  throw new Error("Got unexpected json payload from Github");
}

function exchange_code(code: string): Promise<GithubAuthResponse> {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
  });

  return fetch_token(params);
}

function exchange_refresh_token(refresh_token: string) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  });

  return fetch_token(params);
}

async function get_auth_token(
  res: Response,
  secret: string,
  exchange_function: (arg: string) => Promise<GithubAuthResponse>
): Promise<void> {
  try {
    const github_response = await exchange_function(secret);

    console.log("Authorization successful!");

    res.cookie(
      "refresh_token",
      github_response.refresh_token,
      cookie_settings(github_response.refresh_token_expires_in)
    );
    res.status(200).json({ user_token: github_response.access_token });
  } catch (error) {
    res
      .status(401)
      .json({ error: `Could not get auth token. Error: ${error}` });
  }
}

app.post("/login", (req: Request, res: Response) => {
  if (!("refresh_token" in req.cookies))
    return res.status(401).json({ error: "Invalid refresh token" });

  get_auth_token(
    res,
    req.cookies.refresh_token as string,
    exchange_refresh_token
  );
});

app.get("/github/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string | undefined;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  get_auth_token(res, code, exchange_code);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
