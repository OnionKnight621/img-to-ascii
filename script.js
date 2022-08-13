import { CONSTRAINTS } from "./constants.js";
import { renderImgInCanvas } from "./renderImage.js";
import { getCameraOptions } from "./utils.js";

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
const mode = document.getElementById("setMode");
const cameraOptions = document.querySelector(".video-options>select");
const loadStream = document.getElementById("loadStream");
const stopStream = document.getElementById("stopStream");

loadStream.onclick = async function (e) {
  if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      ...CONSTRAINTS,
      deviceId: {
        exact: cameraOptions.value,
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(
      updatedConstraints
    );

    stopStream.style.display = "initial";
    video.srcObject = stream;
    video.play();
    return;
  }
};

stopStream.onclick = function (e) {
  video.pause();
  video.srcObject = null;
  stopStream.style.display = "none";
};

window.onload = async function (e) {
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    cameraOptions.style.display = "initial";
    loadStream.style.display = "initial";
    navigator.mediaDevices.getUserMedia({ video: true }).then(async (item) => {
      cameraOptions.innerHTML = await getCameraOptions();
    });
  } else {
    cameraOptions.style.display = "none";
    loadStream.style.display = "none";
  }

  stopStream.style.display = "none";

  renderImgInCanvas({
    zoom: Math.abs(setZoom.value),
    symbol: symbolToRender.value,
    isDictionary: isDictionary.checked,
    bgColor: bgColor.value,
    image: image,
    iHeight: setHeight.value,
    iWidth: setWidtht.value,
    mode: mode.value,
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
      mode: mode.value,
    });
  }
});

loadedImg.addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (file) {
    const type = file.type;

    someMessage.innerHTML = "";

    if (type.split("/")[0] === "image") {
      if (FileReader) {
        let fr = new FileReader();
        fr.onload = function () {
          image.src = fr.result;
        };
        fr.readAsDataURL(file);
      }
    }

    if (type.split("/")[0] === "video") {
      video.addEventListener("loadedmetadata", function (e) {
        console.log(video.videoWidth, video.videoHeight);
      });
      video.src = URL.createObjectURL(file);
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
    mode: mode.value,
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
          mode: mode.value,
        });
        // setTimeout(loop, 1000 / 30); // drawing at 30fps
        window.requestAnimationFrame(loop); // drawing natively
      }
    })();
  },
  0
);
