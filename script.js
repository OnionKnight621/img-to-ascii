const loadedImg = document.getElementById("loadFile");
const symbolToRender = document.getElementById("pickSymbol");
const isDictionary = document.getElementById("isDictionary");
const bgColor = document.getElementById("chooseBg");
const setZoom = document.getElementById("setZoom");
const processBtn = document.getElementById("doit");
const image = document.getElementById("myImg");
const someMessage = document.getElementById("someMessage");
const video = document.getElementById("vidos");
const setHeight = document.getElementById("setHeight");
const setWidtht = document.getElementById("setWidth");

const mainCanvas = document.getElementById("mainCanvas");
const resultCanvas = document.getElementById("resultCanvas");

window.onload = function (e) {
  renderImgInCanvas({
    zoom: Math.abs(setZoom.value),
    symbol: symbolToRender.value,
    isDictionary: isDictionary.checked,
    bgColor: bgColor.value,
    image: image,
    iHeight: setHeight.value,
    iWidth: setWidtht.value,
  });
};

document.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    renderImgInCanvas({
      zoom: Math.abs(setZoom.value),
      symbol: symbolToRender.value,
      isDictionary: isDictionary.checked,
      bgColor: bgColor.value,
      image: image,
      iHeight: setHeight.value,
      iWidth: setWidtht.value,
    });
  }
});

loadedImg.addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (file) {
    const type = file.type;

    someMessage.innerHTML = "";

    if (type.split('/')[0] === "image") {
      image.style.display = "initial";

      if (FileReader) {
        let fr = new FileReader();
        fr.onload = function () {
          image.src = fr.result;
        };
        fr.readAsDataURL(file);
      }
    } else {
      image.style.display = "none";
    }

    if (type.split('/')[0] === "video") {
      video.style.display = "initial";

      video.addEventListener("loadedmetadata", function (e) {
        console.log(video.videoWidth, video.videoHeight);
      });
      video.src = URL.createObjectURL(file);
    } else {
      video.style.display = "none";
    }
  } else {
    someMessage.innerHTML = "choose file";
  }
});

processBtn.addEventListener("click", function (e) {
  e.preventDefault();

  renderImgInCanvas({
    zoom: Math.abs(setZoom.value),
    symbol: symbolToRender.value,
    isDictionary: isDictionary.checked,
    bgColor: bgColor.value,
    image: image,
    iHeight: setHeight.value,
    iWidth: setWidtht.value,
  });
});

video.addEventListener(
  "play",
  function () {
    var $this = this; //cache
    (function loop() {
      if (!$this.paused && !$this.ended) {
        renderImgInCanvas({
          zoom: Math.abs(setZoom.value),
          symbol: symbolToRender.value,
          isDictionary: isDictionary.checked,
          bgColor: bgColor.value,
          image: $this,
          iHeight: setHeight.value,
          iWidth: setWidtht.value,
        });
        setTimeout(loop, 1000 / 30); // drawing at 30fps
      }
    })();
  },
  0
);

function pickRandom(dictionary) {
  return dictionary[Math.floor(Math.random() * dictionary.length)];
}

export function renderImgInCanvas({
  zoom,
  symbol,
  isDictionary,
  bgColor,
  image,
  iHeight,
  iWidth,
}) {
  const width = iWidth || 64;
  const height = iHeight || 64;
  const zoomFactor = zoom;
  const pixelReplacement = symbol;
  const dict = symbol.replace(" ").split("");

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
        rCtx.fillText(pickRandom(dict), x, y);
      } else {
        rCtx.fillText(pixelReplacement, x, y);
      }
    }
  }
}
