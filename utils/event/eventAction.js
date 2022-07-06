import axios from "axios";

export const likeEvent = async (id) => {
  try {
    const { data: { data } = {} } = await fetch(`/api/app/event/${id}/like`, {
      method: "POST",
    });
    return data;
  } catch (e) {
    return null;
  }
};

export const bookmarkEvent = async (id) => {
  try {

    const { data: { data } = {} } = await axios.post(`/api/app/event/${id}/bookmark`);


    return data;
  } catch (e) {
    return null;
  }
};

export const unBookmarkEvent = async (id) => {
  try {
    const { data: { data } = {} } = await axios.post(`/api/app/event/${id}/unbookmark`);
    
    return data;
  } catch (e) {
    return null;
  }
};
