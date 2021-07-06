export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const updateIf = (arr, condition, updater) => {
  return (
    arr.reduce(
      ({ updated = false, _arr = [] }, item) => {
        if (condition(item)) {
          return {
            updated: updated || true,
            _arr: [..._arr, updater(item ?? {})],
          };
        } else {
          return { updated: false, _arr: [..._arr, item] };
        }
      },
      { updated: false, _arr: [] }
    )?._arr ?? []
  );
};
