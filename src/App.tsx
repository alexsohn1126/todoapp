import { Outlet, useNavigate } from 'react-router';
import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const navigate = useNavigate();
  const reqSend = useRef(false);
  const [userToken, setUserToken] = useState('');

  // get a new auth token using the cookie. if not successful, ask the user to log in again
  useEffect(() => {
    if (reqSend.current) return;

    reqSend.current = true;
    // TODO: Change the link to be an env var
    fetch('http://localhost:4567/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res: Response) => {
        if (res.ok) return res.json();

        throw new Error("Response from the server not successful");
      })
      .then(res_json => {
        if ('user_token' in res_json) {
          console.log('yesss authed');
          console.log(res_json.user_token);
          setUserToken(res_json.user_token as string);
        } else {
          navigate('/login');
        }
      })
      .catch(error => console.log(`Failed to grab the token and errored out! Error: ${error}`));
  }, []);

  return (
    <>
      <p>Something Something hi hi hi this is the main app thingy eaeyaeyaye y</p>
      {userToken === ''? <p></p> : <p> logged in !!</p>}
      <Outlet />
    </>
  )
}

export default App
