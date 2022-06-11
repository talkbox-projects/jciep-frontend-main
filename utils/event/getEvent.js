import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

let host = publicRuntimeConfig.HOST_URL
  ? publicRuntimeConfig.HOST_URL
  : "http://localhost:3000";

export const getEvents = async (params) => {
  try {
    const { data: { data } = {} } = await axios.get(
      `https://jciep.talkbox.io/api/app/event${params ?? ""}`
    );

    return data;
  } catch (e) {
    return null;
  }
};

export const getStockPhoto = async (params) => {
  try {
    const { data: { data } = {} } = await axios.get(
      `https://jciep.talkbox.io/api/app/stockPhoto`
    );

    return data;
  } catch (e) {
    return null;
  }
};
