let showPageWithToken = async (githubUrl, token) => {
    let rawUrl = githubUrl.replace("github.com", "b884r11mg5.execute-api.us-east-1.amazonaws.com/github-content-proxy/content/" + token).replace("/blob", "");

    // HTML
    document.open();
    document.write(await getDocumentContentWithToken(rawUrl, githubUrl));
    if(!document.head.querySelector('base')) {
        let base = document.createElement('base');
        base.href = rawUrl;
        document.head.appendChild(base);
    }
    document.close();

    // CSS
    while(document.querySelector("link[rel=stylesheet]:not([status=clear])")) {
        let element = document.querySelector("link[rel=stylesheet]:not([status=clear])");
        let href = element.getAttribute("href")
        if (!isPublicUrl(href)) element.outerHTML = '<style status="clear">' + await getContentWithToken(href, githubUrl) + "</style>";
        else element.setAttribute("status", "clear");
    }

    // JS
    while(document.querySelector("script[src]:not([status=clear])")) {
        let element = document.querySelector("script[src]:not([status=clear])");

        let script = document.createElement('script');
        let src = element.getAttribute("src")
        if (!isPublicUrl(src)) {
            script.innerHTML = "(function () {" + await getContentWithToken(src, githubUrl) + "})();";
            console.log(document.body);
            document.body.appendChild(script);
            script.setAttribute("status", "clear");
            element.remove();
        } else element.setAttribute("status", "clear");
    }
    window.dispatchEvent(new Event('load'));

    // <a> link
    while(document.querySelector("a[href]:not([status=clear])")) {
        let element = document.querySelector("a[href]:not([status=clear])");
        let href = element.href;
        element.setAttribute(
            "href",
            href.replace(
                "https://b884r11mg5.execute-api.us-east-1.amazonaws.com/github-content-proxy/" + token,
                location.origin + location.pathname + "?https://github.com/"
            ) + "&" + token
        );
        element.setAttribute("status", "clear");
    }

    // TODO
    // Frame
    // @import
    // loadScript()
}

let getDocumentContentWithToken = (rawUrl, githubUrl) => {
    return new Promise((resolve) => {
        fetch(rawUrl)
            .then(res => {
                if (!res.ok) throw new Error('400 or 500 에러 발생')
                return res.text()
            })
            .then(text => resolve(text))
            .catch(() => showPage(githubUrl))
    });
}

let getContentWithToken = (rawUrl, githubUrl) => {
    return new Promise((resolve) => {
        fetch(rawUrl)
            .then(res => {
                if (!res.ok) throw new Error('400 or 500 에러 발생')
                return res.text()
            })
            .then(text => resolve(text))
            .catch(() => resolve(''))
    });
}