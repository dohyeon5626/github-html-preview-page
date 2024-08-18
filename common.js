let isPublicUrl = (path) => path.startsWith("http://") || path.startsWith("https://");

let getFileUrl = (githubUrl, path) => {
    let urlInfo = githubUrl.split("/");
    if (path.startsWith("/")) {
        urlInfo[7] = path;
    } else {
        urlInfo[urlInfo.length-1] = path;
    }
    return urlInfo.join("/");
}