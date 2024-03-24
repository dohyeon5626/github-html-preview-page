let params = new URLSearchParams(location.search);
let url = params.get("url");
let token = params.get("token");

if (token) showPageWithToken(url, token);
else showPage(url);