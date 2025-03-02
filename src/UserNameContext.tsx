import { createContext, ReactNode, useEffect, useState } from "react";
import { useGithubRequest } from "./utils";

export const UserNameContext = createContext("");

export function UserNameProvider({
  token,
  children,
}: {
  token: string;
  children: ReactNode;
}) {
  const [data] = useGithubRequest("/user", [token]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!("login" in data)) return;
    console.log(`${data.login} is the username`);
    setUserName(data.login as string);
  }, [data]);

  return (
    <UserNameContext.Provider value={userName}>
      {children}
    </UserNameContext.Provider>
  );
}
