// import axios from "axios";

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
    const { data: { data } = {} } = await fetch(`/api/app/event/${id}/bookmark`, {
      method: "POST",
    });
    return data;
  } catch (e) {
    return null;
  }
};

export const unBookmarkEvent = async (id) => {
  try {
    const { data: { data } = {} } = await fetch(`/api/app/event/${id}/unbookmark`, {
      method: "POST",
    });
    return data;
  } catch (e) {
    return null;
  }
};
