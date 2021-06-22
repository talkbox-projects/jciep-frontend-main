import { useAppContext } from "../../store/AppStore";
import { useCallback } from "react";

export const useGetWording = () => {
  const { wordings } = useAppContext();
  const getWording = useCallback(
    (key) => {
      try {
        const [cat, label] = key.split(".");
        return wordings?.[cat]?.[label] ?? `{${key}}`;
      } catch (error) {
        return `{${key}}`;
      }
    },
    [wordings]
  );
  return getWording;
};
