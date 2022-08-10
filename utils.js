export function pickRandom(dictionary) {
  return dictionary[Math.floor(Math.random() * dictionary.length)];
}

export function pickConsistent(dictionary, i) {
  return dictionary[i];
}

export async function getCameraOptions() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((device) => device.kind === "videoinput");
  const options = videoDevices.map(
    (videoDevice) =>
      `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`
  );
  return options.join("");
}
