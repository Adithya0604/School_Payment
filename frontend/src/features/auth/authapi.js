import axios from "axios";
import { getAccessToken, setAccessToken } from "../../utils/fetchWithAuth";

export async function userRegister(userData) {
  try {
    const response = await axios.post(
      "http://localhost:9003/api/user/register/",
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { status: response.status, ...response.data };
  } catch (error) {
    return { status: error.response?.status || 500, message: error.message };
  }
}

export async function userLogin(userData) {
  try {
    const response = await axios.post(
      "http://localhost:9003/api/user/login/",
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.status === 200 && response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }

    return { status: response.status, ...response.data };
  } catch (error) {
    return { status: error.response?.status || 500, message: error.message };
  }
}

export async function userPayment(userData) {
  try {
    const token = getAccessToken();
    const response = await axios.post(
      "http://localhost:9003/api/user/payment/",
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return { status: response.status, ...response.data };
  } catch (error) {
    return { status: error.response?.status || 500, message: error.message };
  }
}

export async function userLogout() {
  try {
    const response = await axios.post(
      "http://localhost:8003/api/user/logout",
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status === 200 && response.data.success) {
      setAccessToken(null);
      localStorage.removeItem("accessToken");
    }

    return { status: response.status, ...response.data };
  } catch (err) {
    return { status: "Error", message: err.message };
  }
}
