const https = require('https');

class HttpModule {
    sendHttpRequest(options, body = null) {
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

            req.end();
        });
    }
}

module.exports = HttpModule;