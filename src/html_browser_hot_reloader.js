module.exports = `<script>
    if (window.location.hostname === "localhost") {
        // Only run these on localhost - to avoid it causing issues
        // if left in by mistake when previewed on a real domain
        websocket_listener();
        ui();
    }

    function ui(){
        if (window.location.href !=="http://localhost:3000/") {
        // only run on pages being iframed, not on the main index page
            console.log("ui loaded", window.location.href);
            let currentElement = document.body;
            let moving = true;
            let x = 10;
            let y = 10;
            let w = 200;
            let h = 20;
            let mx = 0;
            let my = 0;
            const {outline, label, labelText, removeButton, instructions} = createLabel();
            changeOutlineStyle();
            changeLabelStyle();
            changeButtonStyles();
            window.onkeydown = (e) => keyDown(e);
            window.onmousemove = (e)=> move(e);
        
            function createLabel(){
                const instructions = document.getElementById("instructions");
                const outline = document.createElement("DIV");
                const label = document.createElement("DIV");
                const labelText = document.createElement("DIV");
                labelText.textContent = "body";
                const removeButton = document.createElement("BUTTON");
                removeButton.textContent = "remove";
                removeButton.addEventListener("click", do_remove);
                label.append(labelText);
                label.append(removeButton);
                document.body.prepend(outline);
                document.body.prepend(label);
                return {outline, label, labelText, removeButton, instructions};
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
                const hh = moving ? "20px": "auto";
                label.style = "position: absolute; top: "+yy+"px; left: "+xx+"px; height: "+hh+"; background-color: "+color+"; z-index: 1000000000; border-radius: 5px; color: white; padding: 1px 5px;"
            }

            function changeButtonStyles(){
                const display = moving ? "visibility: hidden;" : "visibility: visible;";
                removeButton.style = "background-color: white; color: black; border: none; border-radius: 5px; padding: 0 5px; margin: 5px 0;"+display;
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
                changeButtonStyles();
            }

            function do_remove(){
                const selector = get_unique_selector(currentElement);
                console.log("do_remove", currentElement, selector);
                window.cheerio_mockups_socket.send(JSON.stringify({action:"remove", ...selector, url: window.location.href}));
            }

            function get_unique_selector(el){
                const name = el.tagName;
                const id = el.id;
                const classname = el.className;
                const selector = el.tagName + (id?"#"+id:"") + (classname?"."+classname:"");
                let possible_duplicates = document.querySelectorAll(selector);
                let one_match = possible_duplicates.length === 1;
                let no_matches = possible_duplicates.length === 0;
                console.log("selector",selector, possible_duplicates, one_match, no_matches);
                if (one_match){
                    return {selector};
                } else if (no_matches) {
                    console.log("Oops - can't find ANYTHING with this reference:", selector);
                } else {
                    // multiple matches, so find the index for the matching element
                    let index = -1;
                    possible_duplicates.forEach((possible_el, i) => {
                        console.log(el, possible_el, el.isEqualNode(possible_el));
                        if (el.isEqualNode(possible_el)) {
                            index = i;
                        }
                    });
                    if (index === -1){
                        console.log("Oops - can't find ANYTHING that specifically matches with this reference:", selector);
                    } else {
                        //return the selector, plus the optional index reference
                        return {selector, index};
                    }
                }
            }
        }
    }

    function websocket_listener() {
        window.cheerio_mockups_socket = new WebSocket("ws://localhost:8080");//, [], {"testy": "testy.html"});

        window.cheerio_mockups_socket.onopen = function (e) {
            console.log("[open] Connection established to ", window.location.href);
            if (window.location.href === "http://localhost:3000/"){
                window.cheerio_mockups_socket.send(JSON.stringify({action:"requesting_config"}));
            }
        };

        window.cheerio_mockups_socket.onmessage = function (event) {
            console.log("[message] received from server: " + event.data);
            if (event.data) {
                let request = JSON.parse(event.data);
                if (request && request.action){
                    switch (request.action) {
                        case "sending_config":
                            request.config;
                            console.log("config",request.config);
                            let html = "";
                            request.config.mockups.forEach(mockup=>{
                                html += "<p>" + mockup.name + "</p><ul>";
                                mockup.instructions.forEach(instruction => {
                                    html += "<li>" + instruction.action + ": " + instruction.selector;
                                    if ("index" in instruction) html += "[" + instruction.index + "]";
                                    html += "</li>";
                                });
                                html += "</ul>";
                            });
                            instructions.innerHTML = html;
                            console.log(html);
                            break;
                        case "refresh":
                            location.reload(true);
                            break;
                        default:
                            console.log(request.action);
                            break;
                    }
                }
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
    }
</script>`;
