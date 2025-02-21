import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { setUserToken } from "./auth.ts";
import { TokenContext } from "./AuthContext.ts";
import "./App.css";

let didInit = false;
function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  // get a new auth token using the cookie. if not successful, ask the user to log in again
  useEffect(() => {
    if (didInit) return;

    didInit = true;
    setUserToken()
      .then((userToken) => {
        setToken(userToken);
      })
      .catch((err) => {
        console.log(`error! ${err}`);
        navigate("/login");
      });
  }, []);

  return (
    <TokenContext.Provider value={token}>
      <p>
        Something Something hi hi hi this is the main app thingy eaeyaeyaye y
      </p>
      <Outlet />
    </TokenContext.Provider>
  );
}

export default App;
