export async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      "jciep-token": "fe996608-c839-4b43-acb4-51cd0d810e47",
      "jciep-identityId": "628afcb5d09a524847b26f7f"
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}

export const createEvent = async (submitData) => {
  try {
    postData(
      `/api/app/event/create`,
      submitData
    ).then((data) => data);
  } catch (e) {
    return null;
  }
};
