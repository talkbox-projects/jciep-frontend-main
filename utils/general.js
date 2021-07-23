import { Text } from "@chakra-ui/react";
import React, { useCallback } from "react";

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

export const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const youtubeRegex =
  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

export const passwordRegex =
  /^(?=.*\d*)(?=.*[a-z]*)(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

export const getYoutubeId = (url) => {
  const match = (url ?? "").match(youtubeRegex);
  return match && match[7].length == 11 ? match[7] : null;
};

export const getYoutubeLink = (url) => {
  return `https://youtube.com/embed/${getYoutubeId(url)}`;
};

export const useInjectParams = () => {
  return useCallback((template, params) => {
    return Object.entries(params)
      .reduce(
        (_arr, [key, value]) => {
          return _arr
            .filter((_t) => !!_t)
            .reduce((__arr, _t) => {
              let _t_arr = [_t];
              console.log(_t, "_t", typeof _t === "string");
              if (typeof _t === "string") {
                _t_arr = _t.split(`{{${key}}}`);
              }
              const __r = _t_arr.reduce(
                (_r, __t, i) => (i === 0 ? [__t] : [..._r, value, __t]),
                []
              );
              return [...__arr, ...__r];
            }, []);
        },
        [template]
      )
      .map((x) => {
        return typeof x === "string" ? <Text m={0}>{x}</Text> : x;
      });
  }, []);
};

export const htmlStyles = {
  a: {
    color: "green.500",
    textDecor: "underline",
  },
  table: {
    w: "100%",
    th: {
      borderWidth: "1px",
      borderColor: "gray.500",
      bg: "gray.100",
    },
    td: {
      borderWidth: "1px",
      borderColor: "gray.500",
    },
  },
  "ul, ol": {
    px: 4,
  },
};
