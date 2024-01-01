const HttpModule = require('./HttpModule.js');

class TrestSolarModule {
    static solarUrl = "https://cloud.solar.trest.se"
    static solarPort = 443
    static identityUrl = "https://identity.trest.se"
    static identityPort = 443

    static username = "max"
    static password = "mypassword"

    async setEnergyMode(args, energyMode) {
        const httpHandler = new HttpModule();

        const options = {
            hostname: this.solarUrl,
            port: this.solarPort,
            path: `/api/v1/Solar/SetEnergyProfile/${energyMode}`,
            method: 'POST',
            rejectUnauthorized: false // Allow self-signed certificates
        };

        try {
            const jsonData = JSON.parse(await httpHandler.sendHttpRequest(options));
        } catch (error) { }
    }

    async getSolarHistory(args) {
        const httpHandler = new HttpModule();

        const options = {
            hostname: this.solarUrl,
            port: this.solarPort,
            path: '/api/v1/solar/GetLatestHistory',
            method: 'GET',
            rejectUnauthorized: false // Allow self-signed certificates
        };

        try {
            const jsonData = JSON.parse(await httpHandler.sendHttpRequest(options));

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
        const httpHandler = new HttpHandler();

        const payload = {
            username: this.username,
            passowrd: this.passowrd
        }

        const options = {
            hostname: this.identityUrl,
            port: this.identityPort,
            path: '/api/v1/user/authenticate',
            method: 'POST',
            rejectUnauthorized: false
        };

        try {
            const jsonData = JSON.parse(await httpHandler.sendHttpRequest(options, payload));
            args.error(jsonData);
        } catch (error) {
            args.error(error);
        }
    }
}

module.exports = TrestSolarModule;