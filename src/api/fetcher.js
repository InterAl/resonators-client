import cfg from 'config';

function fetcher(url, options={}) {
    const baseUrl = cfg.baseUrl || '';

    return fetch(`${baseUrl}${url}`, {
                credentials: 'same-origin',
                headers: getDefaultHeaders(),
                ...options
            })
            .then(response => {
                if (response.status >= 300) {
                    if (response.status === 401)
                        return Promise.reject({
                            unauthorized: true
                        });
                    else
                        return Promise.reject(response);
                }

                if (!options.emptyResponse && response.status !== 204)
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

function getDefaultHeaders() {
    return {
        'Authorization': localStorage.getItem('auth_token')
    };
}

export default fetcher;
