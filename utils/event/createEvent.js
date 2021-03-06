export async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}

export const createEvent = async (submitData) => {
  try {
    const result = postData(`/api/app/event/create`, submitData).then(
      (data) => data
    );

    return result
  } catch (e) {
    return null;
  }
};
