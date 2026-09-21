export type NotificationPermissionState = "default" | "granted" | "denied";

export function isPushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window;
}

export async function requestPushPermission(): Promise<NotificationPermissionState> {
  if (!isPushSupported()) {
    return "denied";
  }

  const permission = await Notification.requestPermission();
  return permission as NotificationPermissionState;
}
