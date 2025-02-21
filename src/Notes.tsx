import { useContext, useEffect, useState } from "react";
import { TokenContext } from "./AuthContext";

interface userLogin {
  login: string;
}

async function user_info(token: string): Promise<userLogin> {
  const response = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Github request was unsuccessful");
  }
  const resJson = await response.json();
  if (!("login" in resJson)) {
    throw new Error("Could not find user login from the response");
  }
  return resJson;
}

interface repo {
  id: number;
  name: string;
}

async function getRepos(userName: string, userToken: string): Promise<repo[]> {
  const response = await fetch(
    `https://api.github.com/users/${userName}/repos`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `bearer ${userToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Could not get repository for the user");
  }

  const resJson = await response.json();
  return resJson as repo[];
}

function Notes() {
  const userToken = useContext(TokenContext);
  const [userName, setUserName] = useState("");
  const [repos, setRepos] = useState<repo[]>([]);

  useEffect(() => {
    if (!userToken) return;

    user_info(userToken)
      .then((userLogin) => {
        console.log(userLogin);
        setUserName(userLogin.login);
      })
      .catch((err) => console.log("Failed to grab user information" + err));
  }, [userToken]);

  useEffect(() => {
    if (!userName || !userToken) return;

    getRepos(userName, userToken).then((repoJson) => {
      console.log(repoJson);
      setRepos(repoJson);
    });
  }, [userName]);

  return (
    <div>
      {repos.map((repo) => {
        return <p key={repo.id}>{repo.name}</p>;
      })}
    </div>
  );
}

export default Notes;
