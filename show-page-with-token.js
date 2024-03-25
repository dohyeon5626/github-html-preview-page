let showPageWithToken = async (githubUrl, token) => {
    let rawUrl = githubUrl.replace("github.com", "gfqbuhjryx.us14.qoddiapp.com/github-content/" + token).replace("/blob", "");

    // HTML
    document.open();
    document.write(
        (await getContentWithToken(rawUrl, githubUrl)).replace(/<head([^>]*)>/i, `<head$1><base href="${rawUrl}">`)
    );
    document.close();
    
    // CSS
    document.querySelectorAll("link[rel=stylesheet]").forEach(async (element) => {
        element.outerHTML = "<style>" + await getContentWithToken(element.getAttribute("href"), githubUrl) + "</style>";
    });

    // JS
    let promiseArray = [];
    document.querySelectorAll("script[src]").forEach(async (element) => {
        promiseArray.push(getContentWithToken(element.getAttribute("src"), githubUrl));
    });

    await Promise.all(promiseArray).then(async (contents) => {
        contents.forEach(code => eval(code));
    });
    if (window.onload) window.onload();
    document.dispatchEvent(new Event('DOMContentLoaded', {bubbles: true, cancelable: true}));

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