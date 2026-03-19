import { showPage } from './preview.js';

const [url, token] = location.search.replace("?", "").split("&");

if (url) {
    showPage(url, token);
} else {
    document.getElementById("loading").remove();
    document.getElementById("base").style.opacity = 1;

    document.getElementById("url-button").onclick = () => {
        const input = document.getElementById("url-input").value;
        window.location.href = `${window.location.href.replace("?", "")}?${input}`;
    };
}
