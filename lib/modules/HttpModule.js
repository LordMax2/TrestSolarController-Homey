const https = require('https');

class HttpModule {
    sendHttpRequest(options, body = null, timeout = 2000) {
        return new Promise((resolve, reject) => {
            const req = https.request(options, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    resolve(data);
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (body) {
                req.write(JSON.stringify(body));
            }

            // Set a timeout for the request
            const timeoutId = setTimeout(() => {
                req.abort();
                reject(new Error('Request timed out'));
            }, timeout);

            req.on('finish', () => {
                // Clear the timeout if the request finishes before timeout
                clearTimeout(timeoutId);
            });

            req.end();
        });
    }
}

module.exports = HttpModule;
