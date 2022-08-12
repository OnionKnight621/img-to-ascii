import { MODES } from "./constants.js";
import { pickConsistent, pickRandom } from "./utils.js";

const mainCanvas = document.getElementById("mainCanvas");
const resultCanvas = document.getElementById("resultCanvas");
const main = document.getElementsByTagName("main");

export function renderImgInCanvas({
  zoom,
  symbol,
  isDictionary,
  bgColor,
  image,
  iHeight,
  iWidth,
  mode,
}) {
  const width = iWidth || 64;
  const height = iHeight || 64;
  const zoomFactor = zoom;
  const pixelReplacement = symbol;
  const dict = symbol.replace(" ").split("");

  if (zoom * iWidth > window.innerWidth / 1.3) {
    main[0].style.flexDirection = "column";
  } else {
    main[0].style.flexDirection = "row";
  }

  mainCanvas.width = width;
  mainCanvas.height = height;
  resultCanvas.width = width * zoomFactor;
  resultCanvas.height = height * zoomFactor;
  resultCanvas.fillStyle = bgColor;

  const mCtx = mainCanvas.getContext("2d");
  const rCtx = resultCanvas.getContext("2d");
  rCtx.backgroundColor = bgColor;

  mCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  rCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
  mCtx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);

  const pxArr = mCtx.getImageData(
    0,
    0,
    mainCanvas.width,
    mainCanvas.height
  ).data;

  const wRatio = (mainCanvas.width / width) * zoomFactor;
  const hRatio = (mainCanvas.height / height) * zoomFactor;
  const shift = 0.5;

  rCtx.fillStyle = bgColor;
  rCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);
  rCtx.font = `${wRatio * 1.3}px Arial`;
  rCtx.textAlign = "center";

  let k = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const pxIndex = (i + j * width) * 4;
      const r = pxArr[pxIndex + 0];
      const g = pxArr[pxIndex + 1];
      const b = pxArr[pxIndex + 2];
      const a = pxArr[pxIndex + 3];
      const avg = (r + g + b) / 3;

      rCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;

      const x = i * wRatio + wRatio * shift;
      const y = j * hRatio + hRatio * shift + hRatio / 2;

      if (isDictionary) {
        if (mode === MODES.consistent) {
          if (k === dict.length) k = 0;
          rCtx.fillText(pickConsistent(dict, k), x, y);
          k++;
        } else {
          rCtx.fillText(pickRandom(dict), x, y);
        }
      } else {
        rCtx.fillText(pixelReplacement, x, y);
      }
    }
  }
}
