import { isPublicUrl, fetchText, toRawUrl } from './utils.js';
import { showErrorPage } from './error-page.js';

const injectCSS = async () => {
    while (document.querySelector("link[rel=stylesheet]:not([status=clear])")) {
        const el = document.querySelector("link[rel=stylesheet]:not([status=clear])");
        const href = el.getAttribute("href");
        if (!isPublicUrl(href)) {
            el.outerHTML = `<style status="clear">${await fetchText(href).catch(() => '')}</style>`;
        } else {
            el.setAttribute("status", "clear");
        }
    }
};

const injectJS = async () => {
    while (document.querySelector("script:not([status=clear])")) {
        const el = document.querySelector("script:not([status=clear])");
        const script = document.createElement('script');
        const src = el.getAttribute("src");

        if (src) {
            if (!isPublicUrl(src)) {
                script.innerHTML = await fetchText(src).catch(() => '');
            } else {
                script.src = src;
            }
        } else {
            script.innerHTML = el.innerHTML;
        }

        script.setAttribute("status", "clear");
        document.head.appendChild(script);
        el.remove();
    }
};

const rewriteLinks = () => {
    while (document.querySelector("a[href]:not([status=clear])")) {
        const el = document.querySelector("a[href]:not([status=clear])");
        el.href = el.href.replace(
            "https://raw.githubusercontent.com/",
            `${location.origin}${location.pathname}?https://github.com/`
        );
        el.setAttribute("status", "clear");
    }
};

const showPageLogic = async (rawUrl, data) => {
    document.open();
    document.write(data.replace(
        /<script(?!(?=[^>]*src=["']https?:\/\/))(\s*src=["'][^"']*["'])?(\s*type=["'](text|application)\/javascript["'])?/gi,
        '<script type="text/htmlpreview"$1'
    ));
    if (!document.head.querySelector('base')) {
        const base = document.createElement('base');
        base.href = rawUrl;
        document.head.appendChild(base);
    }
    document.close();

    setTimeout(async () => {
        await injectCSS();
        await injectJS();
        window.dispatchEvent(new Event('load'));
        rewriteLinks();
    }, 100);
};

export const showPage = async (githubUrl, token) => {
    if (token) {
        const tokenUrl = githubUrl
            .replace("github.com", `api.dohyeon5626.com/github-html-preview/content/${token}`)
            .replace("/blob", "");

        await fetchText(tokenUrl)
            .then(data => showPageLogic(tokenUrl, data))
            .catch(async () => {
                const rawUrl = toRawUrl(githubUrl);
                await fetchText(rawUrl)
                    .then(data => showPageLogic(rawUrl, data))
                    .catch(() => showErrorPage());
            });
    } else {
        const rawUrl = toRawUrl(githubUrl);
        await fetchText(rawUrl)
            .then(data => showPageLogic(rawUrl, data))
            .catch(() => showErrorPage());
    }
};
