let token = "";

async function performAuthCheck(): Promise<string> {
  try {
    // TODO: Handle the case where the token may be expired
    // maybe a timedate var to keep track?
    if (token != "") {
      return token;
    }

    // TODO: Change the link to be an env var
    const res = await fetch("http://localhost:4567/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Token validation failed: ${res}`);
    }

    const resData = await res.json();

    if (!("user_token" in resData)) {
      throw new Error(`The response did not contain the token`);
    }

    token = resData.user_token;
    return resData.user_token;
  } catch (error) {
    console.log(`Error while Authenticating user: ${error}`);
    throw error;
  }
}

export const getUserToken = () => {
  return token;
};

export const setUserToken = () => {
  return performAuthCheck();
};
