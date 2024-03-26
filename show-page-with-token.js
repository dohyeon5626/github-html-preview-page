let showPageWithToken = async (githubUrl, token) => {
    let rawUrl = githubUrl.replace("github.com", "gfqbuhjryx.us14.qoddiapp.com/github-content/" + token).replace("/blob", "");

    // HTML
    document.open();
    document.write(
        (await getContentWithToken(rawUrl, githubUrl)).replace(/<head([^>]*)>/i, `<head$1><base href="${rawUrl}">`)
    );
    document.close();
    
    // CSS
    while(document.querySelector("link[rel=stylesheet]")) {
        let element = document.querySelector("link[rel=stylesheet]");
        element.outerHTML = "<style>" + await getContentWithToken(element.getAttribute("href"), githubUrl) + "</style>";
    }

    // JS
    while(document.querySelector("script[src]")) {
        let element = document.querySelector("script[src]");

        let script = document.createElement('script');
		script.innerHTML = await getContentWithToken(element.getAttribute("src"), githubUrl);
		document.body.appendChild(script);

        element.remove();
        window.dispatchEvent(new Event('load'));
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