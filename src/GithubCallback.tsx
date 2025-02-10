import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

function GithubCallback() : JSX.Element {
  const navigate = useNavigate();      
  const [searchParams] = useSearchParams();
  const [loginFailed, setLoginFailed] = useState(false);
  const reqSend = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");

    if (reqSend.current) {
      console.log("Already sent a request!");
      return;
    }

    if (!code) {
      setLoginFailed(true);
      console.log("Failed to extract the code from the URL parameter");
      return;
    }

    reqSend.current = true;

    // TODO: Convert the link to an env var
    fetch(`http://localhost:4567/github/callback?code=${code}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-Type": 'application/json',
      },
    })
      .then(res => {console.log(res); return res})
      .then(data => {
        if (data.status == 200) {
          navigate('/');
          console.log("Successfully logged in..");
        } else {
          setLoginFailed(true);
          console.log("Failed to log in after successful data return");
        }
      })
      .catch(error => {
        console.log(error);
        setLoginFailed(true);
      })

    console.log(code);

  }, [searchParams, navigate]);

  return (
    <>
      {loginFailed? <p>Failed to log in, probably due to github</p>: <p>Logging in..</p>}
    </>
  );
}

export default GithubCallback