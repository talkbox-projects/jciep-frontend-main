/* eslint-disable no-useless-escape */
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
/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const youtubeRegex =
  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

export const phoneRegex = /[0-9]{8}/;

export const passwordRegex =
  /.{8,}$/;

export const getYoutubeId = (url) => {
  const match = (url ?? "").match(youtubeRegex);
  return match && match[7].length == 11 ? match[7] : null;
};

export const getYoutubeLink = (url = "") => {
  if (url.match(youtubeRegex)?.length || 0 > 0) {
    return `https://youtube.com/embed/${getYoutubeId(url)}`;
  }

  return url;
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
    color: "green.800",
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

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  // As a blob
  const blob = await new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, "image/png");
  });

  // As Base64 string
  // const base64 = canvas.toDataURL('image/png');

  return blob;
}

export const blobToBase64 = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      const base64String = reader.result;
      resolve(base64String.substr(base64String.indexOf(",") + 1));
    };
  });
};
