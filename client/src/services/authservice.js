import axios from "axios";

axios.defaults.withCredentials = true;

export async function renewToken() {
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (!refreshToken) {
        return;
    }

    const ret = await axios.post("http://localhost:3001/auth/token", {
        refreshToken: refreshToken.split(" ")[1]
    });

    sessionStorage.setItem("accessToken", ret.data.accessToken);
    sessionStorage.setItem("refreshToken", ret.data.refreshToken);
    return;
}

export function login(data) {
    return axios.post("http://localhost:3001/auth/login/", data);
}

export function register(data) {
    return axios.post("http://localhost:3001/auth/register/", data);
}

export function logout() {
    return axios.put("http://localhost:3001/auth/logout/", {
        refreshToken: sessionStorage.getItem("refreshToken").split(" ")[1]
    });
}