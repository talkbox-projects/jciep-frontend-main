import axios from "axios";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const domain =
typeof window === "undefined"
  ? publicRuntimeConfig.HOST_URL ?? "http://127.0.0.1:3000"
  : window.location.origin;


const defaultParams = {
  orderBy: "startDate",
  orderByAsc: true,
  ended: false,
};

export const getEvents = async (params) => {
  try {
    const { data: { data } = {} } = await axios.get(
      `/api/app/event${params ?? `?${JSON.stringify(defaultParams)}`}`
    );

    return data;
  } catch (e) {
    return null;
  }
};

export const getEventDetail = async (id) => {
  try {
    const { data: { data } = {} } = await axios.get(`${domain}/api/app/event/${id}`);

    return data;
  } catch (e) {
    return null;
  }
};

export const getStockPhoto = async () => {
  try {
    const { data: { data } = {} } = await axios.get(`${domain}/api/app/stockPhoto`);
    return data;
  } catch (e) {
    return null;
  }
};
