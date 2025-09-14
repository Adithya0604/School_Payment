let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
}

export function getAccessToken() {
  return accessToken;
}

export async function fetchWithAuth(url, options = {}) {
  try {
    let res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: "include",
    });

    if (res.status === 401) {
      const refresh = await fetch(
        "http://localhost:9003/api/user/refreshToken",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const refreshData = await refresh.json();

      if (refreshData.success) {
        accessToken = refreshData.accessToken;
        localStorage.setItem("accessToken", accessToken);

        // Retry original request
        res = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
      }
    }

    return res;
  } catch (err) {
    return { error: err.message };
  }
}

const tokenFromStorage = localStorage.getItem("accessToken");
if (tokenFromStorage) {
  setAccessToken(tokenFromStorage);
}
