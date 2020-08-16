import cfg from 'config';
import { saveAs } from 'file-saver';


function fetcher(url, options = {}) {
    const baseUrl = (cfg.baseUrl || '') + '/api';
    return fetch(`${baseUrl}${url}`, {
        credentials: 'same-origin',
        headers: getDefaultHeaders(),
        ...options
    })
        .then(async (response) => {
            if (response.status >= 300) {
                if (response.status === 401)
                    return Promise.reject({
                        unauthorized: true
                    });
                else
                    return Promise.reject(response);
            }
            if (options.downloadResponse && response.ok) {
                const blob = await response.blob();
                saveAs(blob, `resonatorStats-${(new Date()).toLocaleDateString("en-US")}.csv`);
            }
            else if (!options.emptyResponse && response.status !== 204)
                return response.json();
        })
        .catch(err => {
            console.error('failed fetching', err);
            throw err;
        });
}

fetcher.post = (url, body, emptyResponse = false) => {
    return fetcher(url, {
        method: 'POST',
        headers: {
            ...getDefaultHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        emptyResponse
    });
};

fetcher.upload = (url, body) => {
    return fetcher(url, {
        method: 'POST',
        headers: {
            ...getDefaultHeaders(),
            Accept: 'application/json, text/plain, */*'
        },
        body
    });
};

fetcher.put = (url, body) => {
    return fetcher(url, {
        method: 'PUT',
        headers: {
            ...getDefaultHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
};

fetcher.delete = (url) => {
    return fetcher(url, {
        ...getDefaultHeaders(),
        method: 'DELETE',
        emptyResponse: true
    });
};

fetcher.download = (url) => {
    return fetcher(url, {
        headers: {
            ...getDefaultHeaders(),
            Accept: 'text/csv',
        },
        downloadResponse: true,
    });
}

function getDefaultHeaders() {
    if (localStorage.getItem('auth_token') != null)
        return {
            'Authorization': localStorage.getItem('auth_token')
        };
}

export default fetcher;
