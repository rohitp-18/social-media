/// <reference lib="webworker" />
// Basic service worker: push, install, activate, notificationclick
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  const data = event?.data
    ? event.data.json()
    : { title: "Notification", body: "" };
  const title = data.title || "Notification";
  const options = {
    body: data.body || "",
    icon: "/icons/icon-192x192.png",
    data: data.url || "/",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientsArr) => {
      const hadWindow = clientsArr.some((client) => {
        if (client.url === url && "focus" in client) {
          client.focus();
          return true;
        }
        return false;
      });
      if (!hadWindow && self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
