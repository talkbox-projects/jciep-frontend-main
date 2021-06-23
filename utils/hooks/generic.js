import { useEffect, useRef } from "react";

export const usePrevious = (value) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const useValueChanged = (value) => {
  const _value = usePrevious(value);
  return value !== _value;
};
