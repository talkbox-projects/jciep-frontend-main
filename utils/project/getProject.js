import axios from "axios";

export const getProjectDetail = async (id) => {
  try {
    const { data: { data } = {} } = await axios.get(`/api/app/project/${id}`);

    return data;
  } catch (e) {
    return null;
  }
};