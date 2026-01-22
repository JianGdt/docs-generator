import "server-only";
import axios from "axios";

export async function createAuthAxios() {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    withCredentials: true,
  });
}
