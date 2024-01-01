const HttpModule = require('./HttpModule.js');

const solarUrl = "cloud.solar.trest.se";
const solarPort = 443;
const identityUrl = "identity.trest.se";
const identityPort = 443;

var token = "";

class TrestSolarModule {
    async setEnergyMode(args, energyMode) {
        const httpHandler = new HttpModule();

        const options = {
            hostname: solarUrl,
            port: solarPort,
            path: `/api/v1/Solar/SetEnergyProfile/${energyMode}`,
            method: 'POST',
            headers: {
                'X-Token': token
            },
            rejectUnauthorized: false // Allow self-signed certificates
        };

        try {
            var response = await httpHandler.sendHttpRequest(options);

            await this.handleRequestStatus(args, response);

            const jsonData = JSON.parse(response);
        } catch (error) { }
    }

    async getSolarHistory(args) {
        const httpHandler = new HttpModule();

        const options = {
            hostname: solarUrl,
            port: solarPort,
            path: '/api/v1/solar/GetLatestHistory',
            method: 'GET',
            headers: {
                'X-Token': token
            },
            rejectUnauthorized: false // Allow self-signed certificates
        };

        try {
            var response = await httpHandler.sendHttpRequest(options);

            await this.handleRequestStatus(args, response);

            const jsonData = JSON.parse(response);

            if (jsonData) {
                return jsonData;
            } else {
                args.error('Solar history data not available');
                return null;
            }
        } catch (error) {
            args.error('Failed to fetch solar history:', error);
            return null;
        }
    }

    async authenticate(args) {
        const httpHandler = new HttpModule();

        const settings = args.getSettings();

        const payload = {
            email: settings.username,
            password: settings.password
        }

        const options = {
            hostname: identityUrl,
            port: identityPort,
            path: '/api/v1/user/authenticate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            rejectUnauthorized: false
        };

        try {
            args.log("Authenticating");

            var response = await httpHandler.sendHttpRequest(options, payload);

            token = response;

            return token;
        } catch (error) {
            args.error(error);
        }
    }

    async handleRequestStatus(args, response) {
        try {
            if(!response) {
                args.log("Token invalid, renewing token");
                await this.authenticate(args);
                return;
            }

            var responseJson = JSON.parse(response);

            if(responseJson.status && responseJson.status != 200) {
                args.log("Token invalid, renewing token");
                await this.authenticate(args);
                return;
            }
        } catch(error) {
            args.error(error);
        }
    }
}

module.exports = TrestSolarModule;