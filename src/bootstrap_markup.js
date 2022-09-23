const tags = {
    containers: [
        "container",
        "container-sm",
        "container-md",
        "container-lg",
        "container-xl",
        "container-xxl",
        "container-fluid",
    ],
    grid: [
        "row",
        "row row-cols-1",
        "row row-cols-2",
        "row row-cols-3",
        "row row-cols-4",
        "row row-cols-5",
        "row row-cols-6",
        "row row-cols-7",
        "row row-cols-8",
        "row row-cols-9",
        "row row-cols-10",
        "row row-cols-11",
        "row row-cols-12",
        "col",
        //xs
        "col-1",
        "col-2",
        "col-3",
        "col-4",
        "col-5",
        "col-6",
        "col-7",
        "col-8",
        "col-9",
        "col-10",
        "col-11",
        "col-12",
        //sm
        "col-sm-1",
        "col-sm-2",
        "col-sm-3",
        "col-sm-4",
        "col-sm-5",
        "col-sm-6",
        "col-sm-7",
        "col-sm-8",
        "col-sm-9",
        "col-sm-10",
        "col-sm-11",
        "col-sm-12",
        "col-sm-auto",
        //md
        "col-md-1",
        "col-md-2",
        "col-md-3",
        "col-md-4",
        "col-md-5",
        "col-md-6",
        "col-md-7",
        "col-md-8",
        "col-md-9",
        "col-md-10",
        "col-md-11",
        "col-md-12",
        "col-md-auto",
        //lg
        "col-lg-1",
        "col-lg-2",
        "col-lg-3",
        "col-lg-4",
        "col-lg-5",
        "col-lg-6",
        "col-lg-7",
        "col-lg-8",
        "col-lg-9",
        "col-lg-10",
        "col-lg-11",
        "col-lg-12",
        "col-lg-auto",
        //xl
        "col-xl-1",
        "col-xl-2",
        "col-xl-3",
        "col-xl-4",
        "col-xl-5",
        "col-xl-6",
        "col-xl-7",
        "col-xl-8",
        "col-xl-9",
        "col-xl-10",
        "col-xl-11",
        "col-xl-12",
        "col-xl-auto",
        //xxl
        "col-xxl-1",
        "col-xxl-2",
        "col-xxl-3",
        "col-xxl-4",
        "col-xxl-5",
        "col-xxl-6",
        "col-xxl-7",
        "col-xxl-8",
        "col-xxl-9",
        "col-xxl-10",
        "col-xxl-11",
        "col-xxl-12",
        "col-xxl-auto",
    ],
    //these are extra attributes
    columns: [
        //align
        "row align-items-start",
        "row align-items-center",
        "row align-items-end",
        "col align-self-start",
        "col align-self-center",
        "col align-self-end",
        //
        //justify
        "row justify-content-start",
        "row justify-content-center",
        "row justify-content-end",
        "row justify-content-around",
        "row justify-content-between",
        "row justify-content-evenly",
        //
        //force next columns to break to new line
        "w-100 d-none",
        "w-100 d-none d-sm-block",
        "w-100 d-none d-md-block",
        "w-100 d-none d-lg-block",
        "w-100 d-none d-xl-block",
        "w-100 d-none d-xxl-block",
        //
        //re-ordering
        "col order-1",
        "col order-2",
        "col order-3",
        "col order-4",
        "col order-5",
        //re-ordering sm
        "col order-sm-1",
        "col order-sm-2",
        "col order-sm-3",
        "col order-sm-4",
        "col order-sm-5",
        //re-ordering md
        "col order-md-1",
        "col order-md-2",
        "col order-md-3",
        "col order-md-4",
        "col order-md-5",
        //re-ordering lg
        "col order-lg-1",
        "col order-lg-2",
        "col order-lg-3",
        "col order-lg-4",
        "col order-lg-5",
        //re-ordering xl
        "col order-xl-1",
        "col order-xl-2",
        "col order-xl-3",
        "col order-xl-4",
        "col order-xl-5",
        //re-ordering xxl
        "col order-xxl-1",
        "col order-xxl-2",
        "col order-xxl-3",
        "col order-xxl-4",
        "col order-xxl-5",
        //first/last
        "col order-first",
        "col order-last",
        //
        //offset
        "offset-1",
        "offset-2",
        "offset-3",
        "offset-4",
        "offset-5",
        "offset-6",
        "offset-7",
        "offset-8",
        "offset-9",
        "offset-10",
        "offset-11",
        "offset-12",
        //offset sm
        "offset-sm-1",
        "offset-sm-2",
        "offset-sm-3",
        "offset-sm-4",
        "offset-sm-5",
        "offset-sm-6",
        "offset-sm-7",
        "offset-sm-8",
        "offset-sm-9",
        "offset-sm-10",
        "offset-sm-11",
        "offset-sm-12",
        //offset md
        "offset-md-1",
        "offset-md-2",
        "offset-md-3",
        "offset-md-4",
        "offset-md-5",
        "offset-md-6",
        "offset-md-7",
        "offset-md-8",
        "offset-md-9",
        "offset-md-10",
        "offset-md-11",
        "offset-md-12",
        //offset lg
        "offset-lg-1",
        "offset-lg-2",
        "offset-lg-3",
        "offset-lg-4",
        "offset-lg-5",
        "offset-lg-6",
        "offset-lg-7",
        "offset-lg-8",
        "offset-lg-9",
        "offset-lg-10",
        "offset-lg-11",
        "offset-lg-12",
        //offset xl
        "offset-xl-1",
        "offset-xl-2",
        "offset-xl-3",
        "offset-xl-4",
        "offset-xl-5",
        "offset-xl-6",
        "offset-xl-7",
        "offset-xl-8",
        "offset-xl-9",
        "offset-xl-10",
        "offset-xl-11",
        "offset-xl-12",
        //offset xxl
        "offset-xxl-1",
        "offset-xxl-2",
        "offset-xxl-3",
        "offset-xxl-4",
        "offset-xxl-5",
        "offset-xxl-6",
        "offset-xxl-7",
        "offset-xxl-8",
        "offset-xxl-9",
        "offset-xxl-10",
        "offset-xxl-11",
        "offset-xxl-12",
        //offset resets
        "offset-sm-0",
        "offset-md-0",
        "offset-lg-0",
        "offset-xl-0",
        "offset-xxl-0",
        //
        //force away
        "me-auto",
        "ms-auto",
        "ms-sm-auto",
        "ms-md-auto",
        "ms-lg-auto",
        "ms-xl-auto",
        "ms-xxl-auto",
    ],
    gutters: [
        //gutters
        //horizontal
        "gx-0",
        "gx-1",
        "gx-2",
        "gx-3",
        "gx-4",
        "gx-5",
        "gx-auto",
        //vertical
        "gy-0",
        "gy-1",
        "gy-2",
        "gy-3",
        "gy-4",
        "gy-5",
        "gy-auto",
        //both
        "g-0",
        "g-1",
        "g-2",
        "g-3",
        "g-4",
        "g-5",
        "g-auto",
        //
        //padding
        //horizontal
        "px-0",
        "px-1",
        "px-2",
        "px-3",
        "px-4",
        "px-5",
        "px-auto",
        //vertical
        "py-0",
        "py-1",
        "py-2",
        "py-3",
        "py-4",
        "py-5",
        "py-auto",
        //both
        "p-0",
        "p-1",
        "p-2",
        "p-3",
        "p-4",
        "p-5",
        "p-auto",
        //zoiks - see all alternatives too
    ],
};

const start = (tag) => `<${tag} class="`;
const end = (tag) => `</${tag}>`;

const bootstrap_markup = function (name, part, child_name) {
    let tag = "div";
    let id = "";

    //change tag frmo div if provided at start of name, like "h2.classname"
    let tag_split = name.split(".");
    if (tag_split.length > 1) {
        tag = tag_split[0];
        name = tag_split.slice(1).join(".");
    }

    //get id if provided, like "classname#id=testy"
    let id_split = name.split("#");
    if (id_split.length > 1) {
        tag = id_split[1];
        name = id_split[0];
    }
    console.log();
    // if only part of the markup has been requested, provide start or end of the tag
    if (part) {
        if (part === "start") {
            return start(tag) + name + '"' + id + ">";
        } else {
            return end(tag);
        }
        // otherwise provide the whole tag
    } else {
        if (name == "html") {
            return child_name;
        } else {
            return start(tag) + name + '"' + id + ">" + (child_name ? bootstrap_markup(child_name) : "") + end("div");
        }
    }
};

module.exports = bootstrap_markup;
