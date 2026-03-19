const PAGE_HEAD = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Html Preview</title>
    <link rel="icon" type="image/png" sizes="16x16" href="assets/icon/16.png"/>
    <link rel="icon" type="image/png" sizes="32x32" href="assets/icon/32.png"/>
    <link rel="icon" type="image/png" sizes="48x48" href="assets/icon/48.png"/>
    <link rel="icon" type="image/png" sizes="128x128" href="assets/icon/128.png"/>
    <link rel="stylesheet" href="assets/css/style.css">`;

const KEY_ICON = `
    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-key">
        <path fill-rule="evenodd" d="M6.5 5.5a4 4 0 112.731 3.795.75.75 0 00-.768.18L7.44 10.5H6.25a.75.75 0 00-.75.75v1.19l-.06.06H4.25a.75.75 0 00-.75.75v1.19l-.06.06H1.75a.25.25 0 01-.25-.25v-1.69l5.024-5.023a.75.75 0 00.181-.768A3.995 3.995 0 016.5 5.5zm4-5.5a5.5 5.5 0 00-5.348 6.788L.22 11.72a.75.75 0 00-.22.53v2C0 15.216.784 16 1.75 16h2a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V14h.75a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V12h.75a.75.75 0 00.53-.22l.932-.932A5.5 5.5 0 1010.5 0zm.5 6a1 1 0 100-2 1 1 0 000 2z"></path>
    </svg>`;

const writeDocument = (html) => {
    document.open();
    document.write(html);
    document.close();
};

const renderConflictPage = () => `
    ${PAGE_HEAD}
    <div id="error">
        <h1 id="error-title">409 Conflict</h1>
        <p id="error-text">Invalid access. Please access through the preview button from the beginning.</p>
    </div>`;

const renderNotFoundPage = (buttonId) => `
    ${PAGE_HEAD}
    <div id="error">
        <h1 id="error-title">404 Not Found</h1>
        <p id="error-text">This might be when permissions are required. Try setting up a token!<br/>Even if you enter a valid token, it may fail because the request count limit has been exceeded.</p>
        <div id="token-box">
            <div id="token-input-box">
                ${KEY_ICON}
                <input type="text" id="token-input" placeholder="Input github token">
            </div>
            <button id="${buttonId}">Enter</button>
        </div>
    </div>`;

export const showErrorPage = () => {
    const [, token, time] = location.href.split("&");

    if (token?.startsWith('ey')) {
        const isExpired = time && (Number(time) + 3600000) - Date.now() <= 0;
        writeDocument(isExpired ? renderConflictPage() : renderNotFoundPage("token-button"));
        return;
    }

    writeDocument(renderNotFoundPage("raw-token-button"));

    if (token) document.getElementById("token-input").value = token;
    document.getElementById("raw-token-button").onclick = () => {
        const newToken = document.getElementById("token-input").value;
        const base = location.href.split("&")[0];
        location.href = newToken ? `${base}&${newToken}` : base;
    };
};
