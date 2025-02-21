import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

let didInit = false;

function GithubCallback(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loginFailed, setLoginFailed] = useState(false);

  const code = searchParams.get("code");

  if (!code) {
    setLoginFailed(true);
    console.log("Failed to extract the code from the URL parameter");
  }

  useEffect(() => {
    if (didInit) return;
    didInit = true;
    // TODO: Convert the link to an env var
    fetch(`http://localhost:4567/github/callback?code=${code}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        return res;
      })
      .then((data) => {
        if (data.ok) {
          navigate("/");
          console.log("Successfully logged in..");
        } else {
          setLoginFailed(true);
          console.log("Failed to log in after successful data return");
        }
      })
      .catch((error) => {
        console.log(error);
        setLoginFailed(true);
      });
  });

  return (
    <>
      {loginFailed ? (
        <p>Failed to log in, probably due to github</p>
      ) : (
        <p>Logging in..</p>
      )}
    </>
  );
}

export default GithubCallback;
