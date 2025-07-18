let showErrorPage = () => {
    let token = location.href.split("&")[1];
    let time = location.href.split("&")[2];

    if (token && token.startsWith('ey')) {
        document.open();
        if (time && (Number(time) + 3600000) - new Date().getTime() <= 0) {
            document.write(`
                <link rel="stylesheet" href="index.css">
                <div id="error">
                    <h1 id="error-title">409 Conflict</h1>
                    <p id="error-text">Invalid access. Please access through the preview button from the beginning.</p>
                </div>
            `);
        } else {
            document.write(`
                <link rel="stylesheet" href="index.css">
                <div id="error">
                    <h1 id="error-title">404 Not Found</h1>
                    <p id="error-text">This might be when permissions are required. Try setting up a token!<br/>Even if you enter a valid token, it may fail because the request count limit has been exceeded.</p>
                    <div id="token-box">
                        <div id="token-input-box">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-key">
                                <path fill-rule="evenodd" d="M6.5 5.5a4 4 0 112.731 3.795.75.75 0 00-.768.18L7.44 10.5H6.25a.75.75 0 00-.75.75v1.19l-.06.06H4.25a.75.75 0 00-.75.75v1.19l-.06.06H1.75a.25.25 0 01-.25-.25v-1.69l5.024-5.023a.75.75 0 00.181-.768A3.995 3.995 0 016.5 5.5zm4-5.5a5.5 5.5 0 00-5.348 6.788L.22 11.72a.75.75 0 00-.22.53v2C0 15.216.784 16 1.75 16h2a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V14h.75a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V12h.75a.75.75 0 00.53-.22l.932-.932A5.5 5.5 0 1010.5 0zm.5 6a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                            <input type="text" id="token-input" placeholder="Input github token">
                        </div>
                        <button id="token-button">Enter</button>
                    </div>
                </div>
            `);
        }
        document.close();
    } else {
        document.open();
        document.write(`
            <link rel="stylesheet" href="index.css">
            <div id="error">
                <h1 id="error-title">404 Not Found</h1>
                <p id="error-text">This might be when permissions are required. Try setting up a token!<br/>Even if you enter a valid token, it may fail because the request count limit has been exceeded.</p>
                <div id="token-box">
                    <div id="token-input-box">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-key">
                            <path fill-rule="evenodd" d="M6.5 5.5a4 4 0 112.731 3.795.75.75 0 00-.768.18L7.44 10.5H6.25a.75.75 0 00-.75.75v1.19l-.06.06H4.25a.75.75 0 00-.75.75v1.19l-.06.06H1.75a.25.25 0 01-.25-.25v-1.69l5.024-5.023a.75.75 0 00.181-.768A3.995 3.995 0 016.5 5.5zm4-5.5a5.5 5.5 0 00-5.348 6.788L.22 11.72a.75.75 0 00-.22.53v2C0 15.216.784 16 1.75 16h2a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V14h.75a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V12h.75a.75.75 0 00.53-.22l.932-.932A5.5 5.5 0 1010.5 0zm.5 6a1 1 0 100-2 1 1 0 000 2z"></path>
                        </svg>
                        <input type="text" id="token-input" placeholder="Input github token">
                    </div>
                    <button id="raw-token-button">Enter</button>
                </div>
            </div>
        `);
        document.close();

        let token = location.href.split("&")[1];
        if (token) document.getElementById("token-input").value = token;

        document.getElementById("raw-token-button").onclick = () => {
            let token = document.getElementById("token-input").value;
            if (token == "") location.href = location.href.split("&")[0]
            else location.href = location.href.split("&")[0] + "&" + token
        };
    }
}

let showPage = async (githubUrl, token) => {
    if (token) {
        let rawUrl = githubUrl.replace("github.com", "licorice-api.dohyeon5626.com/github-content-proxy/content/" + token).replace("/blob", "");
        let data = await getDocumentContentWithToken(rawUrl, githubUrl);
        showPageLogic(rawUrl, data);
    } else {
        let rawUrl = githubUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob", "");
        let data = await getDocumentContent(rawUrl);
        showPageLogic(rawUrl, data);
    }
}

let showPageLogic = async (rawUrl, data) => {
    // HTML
    document.open();
    document.write(data.replace(
        /<script(?!(?=[^>]*src=["']https?:\/\/))(\s*src=["'][^"']*["'])?(\s*type=["'](text|application)\/javascript["'])?/gi,
        '<script type="text/htmlpreview"$1'
    ));
    if(!document.head.querySelector('base')) {
        let base = document.createElement('base');
        base.href = rawUrl;
        document.head.appendChild(base);
    }
    document.close();
    
    setTimeout(async () => {
        // CSS
        while(document.querySelector("link[rel=stylesheet]:not([status=clear])")) {
            let element = document.querySelector("link[rel=stylesheet]:not([status=clear])");
            let href = element.getAttribute("href")
            if (!isPublicUrl(href)) element.outerHTML = '<style status="clear">' + await getContent(href) + "</style>";
            else element.setAttribute("status", "clear");
        }

        // JS
        while(document.querySelector(`script:not([status=clear])`)) {
            let element = document.querySelector(`script:not([status=clear])`);
            console.log(element)

            let script = document.createElement('script');
            let src = element.getAttribute("src")
            if(src) {
                if (!isPublicUrl(src)) {
                    script.innerHTML = await getContent(src);
                    script.setAttribute("status", "clear");
                    document.head.appendChild(script);
                    element.remove();
                } else {
                    script.src = src;
                    script.setAttribute("status", "clear");
                    document.head.appendChild(script);
                    element.remove();
                }
            } else {
                script.innerHTML = element.innerHTML;
                script.setAttribute("status", "clear");
                document.head.appendChild(script);
                element.remove();
            }
        }
        window.dispatchEvent(new Event('load'));

        // <a> link
        while(document.querySelector("a[href]:not([status=clear])")) {
            let element = document.querySelector("a[href]:not([status=clear])");
            let href = element.href;
            element.setAttribute(
                "href",
                href.replace(
                    "https://raw.githubusercontent.com/",
                    location.origin + location.pathname + "?https://github.com/"
                )
            );
            element.setAttribute("status", "clear");
        }
    }, 100);
}

let getDocumentContent = (rawUrl) => {
    return new Promise((resolve) => {
        fetch(rawUrl)
            .then(res => {
                if (!res.ok) throw new Error('400 or 500 에러 발생')
                return res.text()
            })
            .then(text => resolve(text))
            .catch(() => showErrorPage())
    });
}

let getDocumentContentWithToken = (rawUrl, githubUrl) => {
    return new Promise((resolve) => {
        fetch(rawUrl)
            .then(res => {
                if (!res.ok) throw new Error('400 or 500 에러 발생')
                return res.text()
            })
            .then(text => resolve(text))
            .catch(async () => {
                let rawUrl = githubUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob", "");
                let data = await getDocumentContent(rawUrl);
                showPageLogic(rawUrl, data);
            })
    });
}

let getContent = (rawUrl) => {
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