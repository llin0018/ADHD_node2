const publicVapidKey =
    "BFK5PhfCkJhUQOHbR7X9e0hKLhwN4RMAOBwhOBFqPHtiYuNpWCMdfp2dTAXe4gu3WLYBp0-fZPTUa2E4nP7Tk9M";

// Check for service worker
if ("serviceWorker" in navigator) {
    send().catch(err => console.error(err));
}

// module.exports = send();
// Register SW, Register Push, Send Push
async function send() {
    // Register Service Worker
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/"
    });

// .then(function (registration) {
//         registration.update();
//     }).catch(function(error) {
//         // registration failed
//         console.log('Registration failed with ' + error);
//     })

    console.log("Service Worker Registered...");

    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log("Push Registered...");

    // Send Push Notification
    console.log("Sending Push...");
    await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json"
        }
    });
    console.log("Push Sent...");
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


// const cron =  require('node-cron');
// const send = require('./client/client');
//
// cron.schedule("* * * * * *", () =>{
//     let date_ob = new Date();
//     const hour = date_ob.getHours();
//     const min = date_ob.getMinutes();
//     const second = date_ob.getSeconds();
//     console.log(hour+":"+min+":"+second);
//     send.send();
//
// });