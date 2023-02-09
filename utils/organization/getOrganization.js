import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const domain =
typeof window === "undefined"
  ? publicRuntimeConfig.HOST_URL ?? "http://127.0.0.1:3000"
  : window.location.origin;

export const getOrganization = async (id) => {
  try {
    const { data: { data } = {} } = await axios.get(`${domain}/api/app/organization/${id}`);

    return data;
  } catch (e) {
    return null;
  }
};