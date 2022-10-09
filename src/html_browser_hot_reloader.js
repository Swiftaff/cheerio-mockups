module.exports = `<script>
    websocket_listener();
    ui();

    function ui(){
        if (window.location.href !=="http://localhost:3000/") {
            console.log("loaded", window.location.href);
            let currentElement = document.body;
            let moving = true;
            let x = 10;
            let y = 10;
            let w = 200;
            let h = 20;
            let mx = 0;
            let my = 0;
            const {outline, label, labelText} = createLabel();
            changeOutlineStyle();
            changeLabelStyle();
            window.onkeydown = (e) => keyDown(e);
            window.onmousemove = (e)=> move(e);
        
            function createLabel(){
                const outline = document.createElement("DIV");
                const label = document.createElement("DIV");
                const labelText = document.createTextNode("body");
                label.appendChild(labelText);
                document.body.prepend(outline);
                document.body.prepend(label);
                return {outline, label, labelText};
            }
        
            function move(e){
                mx = e.clientX;
                my = e.clientY;
                const els = document.elementsFromPoint(mx,my);
                changeLabelStyle();
                if (moving && currentElement !== els[0]) changeCurrentElement(els[0]); // gets first element only
            }

            function changeCurrentElement(el){
                const name = el.tagName;
                const id = el.id;
                const classname = el.className;
                const text = el.tagName + (id?"#"+id:"") + (classname?"."+classname:"");

                const {x:x_temp,y:y_temp,width, height} = el.getBoundingClientRect();
                x = x_temp;
                y = y_temp;
                w = Math.floor(width);
                h = Math.floor(height);

                currentElement = el;
                labelText.textContent = text;
                changeOutlineStyle();
            }

            function changeOutlineStyle(){
                const color = moving ? "blue" : "red";
                const stroke = moving ? 1 : 2;
                outline.style = "position: absolute; top: "+y+"px; left: "+x+"px; width: "+w+"px; height: "+h+"px; border: "+stroke+"px dashed "+color+"; z-index: 1000000000; pointer-events: none;"
            }

            function changeLabelStyle(){
                const color = moving ? "grey" : "red";
                const stroke = moving ? 1 : 2;
                const xx = moving ? mx+20: x;
                const yy = moving ? my+20: y + h + stroke;
                label.style = "position: absolute; top: "+yy+"px; left: "+xx+"px; height: 20px; background-color: "+color+"; z-index: 1000000000; border-radius: 5px; color: white; padding: 1px 5px;"
            }

            function keyDown(e) {
                if(e.keyCode === 27) {
                    toggleMoving();
                }
            }

            function toggleMoving(){
                moving = !moving;
                changeOutlineStyle();
                changeLabelStyle();
            }
        }
    }

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
