export function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = crypto.randomUUID();   // 👈 generate UUID
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}
