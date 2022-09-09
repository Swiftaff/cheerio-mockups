module.exports = `<script>
websocket_listener();

function websocket_listener() {
    // TODO: only run this on localhost - to avoid it causing issues if left in by mistake when previewed on a real domain
    
    console.log("websocket_listener",window.location.hostname);

    let socket = new WebSocket("ws://localhost:8080");

    socket.onopen = function (e) {
        console.log("[open] Connection established");
    };

    socket.onmessage = function (event) {
        console.log("[message] received from server: " + event.data);
        location.reload(true);
    };

    socket.onerror = function (error) {
        console.log("[error] " + error.message);
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log("[close] Connection closed cleanly, code=" + event.code + " reason=" + event.reason);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log("[close] Connection died - attempting to reload ws connection...");
        }
        websocket_listener();
    };
}
</script>`;
