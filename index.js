let data = location.search.split("&");
let url = data[0].replace("?", "");
let token = data[1];

if (token) showPageWithToken(url, token);
else showPage(url);