import cfg from "config";
import { saveAs } from "file-saver";

const API_PREFIX = "api";
const BASE_URL = `${cfg.baseUrl || ""}/${API_PREFIX}`;

function fetcher(url, options = {}) {
    console.log(BASE_URL + url);
    return fetch(BASE_URL + url, {
        credentials: "same-origin",
        ...options,
        headers: {
            ...getDefaultHeaders(),
            ...(options.headers || {}),
        },
    }).then((response) => handleResponse(response, options));
}

fetcher.get = fetcher;

fetcher.post = (url, body, emptyResponse = false) => {
    return fetcher(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        emptyResponse,
    });
};

fetcher.put = (url, body) => {
    return fetcher(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
};

fetcher.delete = (url, body = {}) => {
    return fetcher(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        emptyResponse: true,
        body: JSON.stringify(body),
    });
};

fetcher.upload = (url, body) => {
    return fetcher(url, {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
        },
        body,
    });
};

fetcher.download = (url) => {
    return fetcher(url, {
        headers: {
            Accept: "text/csv",
        },
        download: true,
    });
};

function handleResponse(response, options) {
    if (!response.ok) {
        return getErrorPayload(response).then((error) => Promise.reject(error));
    }
    if (options.download) {
        return downloadPayload(response);
    }
    if (options.emptyResponse) {
        return Promise.resolve();
    }
    return response.json();
}

function getDefaultHeaders() {
    if (localStorage.getItem("auth_token") != null)
        return {
            Authorization: localStorage.getItem("auth_token"),
        };
}

function getErrorPayload(response) {
    return hasJson(response) ? response.json() : response.text();
}

function downloadPayload(response) {
    return response.blob().then((blob) => saveAs(blob, getResponseFileName(response)));
}

function getResponseFileName(response) {
    const encodedDisposition = response.headers.get("content-disposition");
    const disposition = decodeURIComponent(encodedDisposition);
    if (disposition && disposition.includes("attachment")) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        return matches?.[1]?.replace(/['"]/g, "");
    }
}

function hasJson(response) {
    return response.headers.get("Content-Type")?.includes("application/json");
}

export default fetcher;
