import { useContext, useEffect, useState } from "react";
import { TokenContext } from "./AuthContext";

export function useGithubRequest(
  path: string,
  dependencies: (string | undefined)[] = []
) {
  const [data, setData] = useState({});
  const userToken = useContext(TokenContext);

  useEffect(() => {
    if (userToken === "") return;
    for (let d of dependencies) {
      if (typeof d === "undefined" || d.toString() === "") return;
    }

    fetch(`https://api.github.com${path}`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `bearer ${userToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Request was not sccessful");
        return response.json();
      })
      .then((resJson) => {
        setData(resJson);
      });
  }, [userToken, path, ...dependencies]);

  return [data];
}
