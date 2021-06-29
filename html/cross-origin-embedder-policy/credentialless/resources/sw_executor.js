importScripts('./dispatcher.js');

const params = new URLSearchParams(location.search);
const uuid = params.get('uuid');

// The fetch handler must be registered before parsing the main script response.
// So do it here, for future use.
fetchHandler = () => {}
self.addEventListener('fetch', e => {
  fetchHandler(e);
});

// Force ServiceWorker to immediately activate itself after being installed.
self.addEventListener('install', function (event) {
  self.skipWaiting();
});

// The statechange handler must be registered before parsing the main script
// response. So do it here. Used to know when the ServiceWorker is registered.
const activated = new Promise(resolve => {
  self.addEventListener('activate', event => {
    self.clients.claim();
    resolve();
  })
});

let executeOrders = async function() {
  while(true) {
    let task = await receive(uuid);
    eval(`(async () => {${task}})()`);
  }
};
executeOrders();
