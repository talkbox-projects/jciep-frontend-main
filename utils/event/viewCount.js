import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const domain =
typeof window === "undefined"
  ? publicRuntimeConfig.HOST_URL ?? "http://127.0.0.1:3000"
  : window.location.origin;

export const addView = async (id) => {
  try {
    const result = axios.post(`${domain}/api/app/event/${id}/view`).then(
      (data) => {
        return data;
      }
    );

    return result
  } catch (e) {
    return null;
  }
};
