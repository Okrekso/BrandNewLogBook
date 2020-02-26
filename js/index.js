import $ from "jquery";
import render from "../jsx/render";

$(document).ready(() => {
    render($("#container")[0]);
})