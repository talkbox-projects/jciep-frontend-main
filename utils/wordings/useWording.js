import { useAppContext } from "../../store/AppStore";
import { useCallback } from "react";

export const useGetWording = () => {
  const { wordings } = useAppContext();

  const mergeParamsWithWording = useCallback((template, params) => {
    return Object.entries(params).reduce(
      (_arr, [key, value]) => {
        return _arr.reduce((__arr, _t) => {
          const _t_arr = _t.split(`{{${key}}}`);
          const __r = _t_arr.reduce(
            (_r, __t, i) => (i === 0 ? [__t] : [..._r, value, __t]),
            []
          );
          return [...__arr, ...__r];
        }, []);
      },
      [template]
    );
  }, []);

  const getWording = useCallback(
    (key, { params = {}, defaultValue } = {}) => {
      try {
        const [cat, label] = key.split(".");
        return mergeParamsWithWording(
          wordings?.[cat]?.[label] ?? defaultValue ?? `{${key}}`,
          params
        );
      } catch (error) {
        return `{${key}}`;
      }
    },
    [wordings]
  );
  return getWording;
};
