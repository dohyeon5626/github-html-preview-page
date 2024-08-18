if (location.search != '') {
    let data = location.search.split("&");
    let url = data[0].replace("?", "");
    let token = data[1];

    while(document.body == null) {
        console.log("document body load fail");
    }

    if (token) showPageWithToken(url, token);
    else showPage(url);
} else {
    document.getElementById("loading").remove();
    document.getElementById("base").style.opacity = 1;

    document.getElementById("url-button").onclick = () => {
        window.location.href = window.location.href.replace("?", "") + "?" + document.getElementById("url-input").value;
    }
}