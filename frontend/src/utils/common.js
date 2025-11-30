export function getDeviceId() {
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = crypto.randomUUID();   // 👈 generate UUID
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}
