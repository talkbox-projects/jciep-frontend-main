export const likeEvent = async (id, token, identityId) => {
  try {
    const { data: { data } = {} } = await fetch(`/api/app/event/${id}/like`, {
        method: 'POST',
        headers: {
          'jciep-token': token,
          'jciep-identityId': identityId
        }
      })

    return data;
  } catch (e) {
    return null;
  }
};

export const bookmarkEvent = async (id) => {
    try {
      const { data: { data } = {} } = await fetch(`/api/app/event/${id}/bookmark`, {
          method: 'POST',
        })
  
      return data;
    } catch (e) {
      return null;
    }
  };