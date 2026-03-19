export const isPublicUrl = (path) =>
    path.startsWith("http://") || path.startsWith("https://");

export const getFileUrl = (githubUrl, path) => {
    const parts = githubUrl.split("/");
    parts[path.startsWith("/") ? 7 : parts.length - 1] = path;
    return parts.join("/");
};

export const fetchText = (url) =>
    fetch(url).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
    });

export const toRawUrl = (githubUrl) =>
    githubUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob", "");
