module.exports = `<script>
    websocket_listener();

    function websocket_listener() {
        // Only run this on localhost - to avoid it causing issues if left in by mistake when previewed on a real domain

        if (window.location.hostname == "localhost") {
            window.cheerio_mockups_socket = new WebSocket("ws://localhost:8080");

            window.cheerio_mockups_socket.onopen = function (e) {
                console.log("[open] Connection established");
            };

            window.cheerio_mockups_socket.onmessage = function (event) {
                console.log("[message] received from server: " + event.data);
                if (event.data==="Refresh") {
                    location.reload(true);
                } else {
                    window.cheerio_mockups_socket_stop = true;
                }
            };

            window.cheerio_mockups_socket.onerror = function (error) {
                console.log("[error] " + error.message);
            };

            window.cheerio_mockups_socket.onclose = function (event) {
                if (event.wasClean) {
                    console.log("[close] Connection closed cleanly, code=" + event.code + " reason=" + event.reason);
                } else {
                    // e.g. server process killed or network down
                    // event.code is usually 1006 in this case
                    console.log("[close] Connection died - attempting to reload ws connection...");
                }
                websocket_listener();
            };
            setTimeout(()=>{
                console.log("send?");
                //window.cheerio_mockups_socket.send("message");
            }, 2000);
            
        }
    }
</script>`;
