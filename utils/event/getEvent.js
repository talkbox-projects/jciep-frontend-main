import axios from "axios";

const defaultParams = {
  orderBy: "createdAt",
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
    const { data: { data } = {} } = await axios.get(`/api/app/event/${id}`);

    return data;
  } catch (e) {
    return null;
  }
};

export const getStockPhoto = async () => {
  try {
    const { data: { data } = {} } = await axios.get(`/api/app/stockPhoto`);
    return data;
  } catch (e) {
    return null;
  }
};
