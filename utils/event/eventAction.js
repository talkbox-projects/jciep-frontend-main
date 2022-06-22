import { parseCookies, setCookie, destroyCookie } from "nookies";
const cookies = parseCookies();
import axios from "axios";

export const likeEvent = async (id, token, identityId) => {
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
  axios.post(`/api/app/event/${id}/bookmark`)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

  // try {
  //   const { data: { data } = {} } = await fetch(
  //     `/api/app/event/${id}/bookmark`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   return data;
  // } catch (e) {
  //   return null;
  // }
};
