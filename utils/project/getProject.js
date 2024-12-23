import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const domain =
typeof window === "undefined"
  ? publicRuntimeConfig.HOST_URL ?? "http://127.0.0.1:3000"
  : window.location.origin;

export const getProjectDetail = async (id) => {
  try {
    const { data: { data } = {} } = await axios.get(`${domain}/api/app/project/${id}`);
    return data;
  } catch (e) {
    return null;
  }
};

export const getProjectCreatedBy = async (ids) => {
  try {
    const { data: { data } = {} } = await axios.get(`${domain}/api/app/identity/gets`, { params: { ids: [ids] } });
    return data;
  } catch (e) {
    return null;
  }
};

export const getProjects = async ({limit, offset, category}) => {
  try {
    const { data: { data } = {} } = await axios.get(`${domain}/api/app/project`,  { params: { limit, offset, category } });

    return data;
  } catch (e) {
    return null;
  }
};

export const getProjectCategories = async () => {
  try {
    const { data: { data } = {} } = await axios.get(`${domain}/api/app/project/category`);

    return data;
  } catch (e) {
    return null;
  }
};