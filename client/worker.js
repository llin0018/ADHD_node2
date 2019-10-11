
console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
    const data = e.data.json();

    var dts = Date.now() + 10000;
    const bb = data.content;
    console.log(Date.now());
    console.log(dts);
    console.log("4");
    console.log(data);
    console.log(bb);

    console.log("Push Recieved...");
    self.registration.showNotification(data.title, bb);
});