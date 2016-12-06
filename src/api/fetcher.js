function fetcher(url, options={}) {
    return fetch(url, {
                credentials: 'same-origin',
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

fetcher.post = (url, body) => {
    return fetcher(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
};

fetcher.put = (url, body) => {
    return fetcher(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
};

export default fetcher;
