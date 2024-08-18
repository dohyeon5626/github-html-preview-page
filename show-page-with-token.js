let showPageWithToken = async (githubUrl, token) => {
    let rawUrl = githubUrl.replace("github.com", "gfqbuhjryx.us14.qoddiapp.com/github-content/" + token).replace("/blob", "");

    // HTML
    document.open();
    document.write(
        (await getContentWithToken(rawUrl, githubUrl)).replace(/<head([^>]*)>/i, `<head$1><base href="${rawUrl}">`)
    );
    document.close();
    
    // CSS
    while(document.querySelector("link[rel=stylesheet]:not([status=clear])")) {
        let element = document.querySelector("link[rel=stylesheet]");
        let href = element.getAttribute("href")
        if (!isPublicUrl(href)) element.outerHTML = '<style status="clear">' + await getContentWithToken(href, githubUrl) + "</style>";
        else element.setAttribute("status", "clear");
    }

    // JS
    while(document.querySelector("script[src]")) {
        let element = document.querySelector("script[src]");

        let script = document.createElement('script');
        let src = element.getAttribute("src")
        if (!isPublicUrl(src)) {
            script.innerHTML = await getContentWithToken(src, githubUrl);
            document.body.appendChild(script);
            script.setAttribute("status", "clear");
            element.remove();
            window.dispatchEvent(new Event('load'));
        } else element.setAttribute("status", "clear");
    }

    // TODO
    // Frame
    // <a> link
    // @import
    // loadScript()
}

let getContentWithToken = (rawUrl, githubUrl) => {
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