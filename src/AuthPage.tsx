import { Outlet, useNavigate } from "react-router";
import { TokenContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { setUserToken } from "./auth";
import { UserNameProvider } from "./UserNameContext";
import SideBar from "./SideBar";

let didInit = false;
function AuthPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  // get a new auth token using the cookie.
  // if not successful, ask the user to log in again
  useEffect(() => {
    if (didInit) return;

    didInit = true;
    setUserToken()
      .then((userToken) => {
        setToken(userToken);
      })
      .catch((err) => {
        console.log(`token error! ${err}`);
        navigate("/login");
      });
  }, []);

  return (
    <TokenContext.Provider value={token}>
      <UserNameProvider token={token}>
        <div className="flex gap-1 bg-neutral-900 text-neutral-200">
          <SideBar />
          <Outlet />
        </div>
      </UserNameProvider>
    </TokenContext.Provider>
  );
}

export default AuthPage;
