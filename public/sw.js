self.addEventListener('install', (event) => {
    console.log('Service Worker installert!');
  });
  
  self.addEventListener('fetch', event => {
      console.log("Request intercepted:", event.request.url);
  });
  