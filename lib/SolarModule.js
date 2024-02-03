const TrestSolarModule = require('./modules/TrestSolarModule.js');

class SolarModule {
    async Init(args) {
        var trestSolarModule = new TrestSolarModule();

        // Authenticate on login
        await trestSolarModule.authenticate(args);

        // Set up an interval to call httpGetSolarHistory every 30 seconds
        this.solarHistoryInterval = setInterval(async () => {
            try {
                args.log("Updating solar information");
                let solarHistory = await trestSolarModule.getSolarHistory(args);

                this.setSolarHistoryCapabilites(args, solarHistory);
            } catch (error) {
                args.error('Failed to fetch solar history:', error);
            }
        }, 5000);
    }

    async InitButtons(args) {
        var trestSolarModule = new TrestSolarModule();

        args.log("Initialize buttons");

        try {
            args.registerCapabilityListener('sell_button', trestSolarModule.setEnergyMode.bind(args, 5));
            args.registerCapabilityListener('buy_button', trestSolarModule.setEnergyMode.bind(args, 4));
            args.registerCapabilityListener('self_sufficient_button', trestSolarModule.setEnergyMode.bind(args, 1));
            args.registerCapabilityListener('pause_button', trestSolarModule.setEnergyMode.bind(args, 6));
        } catch(error) {
            args.error("Failed to initialize buttons", error);
        }        
    }

    setSolarHistoryCapabilites(args, jsonData) {
        args.log("Updating solar capabilities");

        try {
            args.setCapabilityValue('real_time_solar', jsonData.realtimeSolar);
            args.setCapabilityValue('measure_battery', parseInt(jsonData.batteryCapacity));
            args.setCapabilityValue('total_load_active_power', jsonData.totalLoadActivePower);
            args.setCapabilityValue('battery_charging', parseFloat(parseFloat(jsonData.batteryCharge.slice(0, -2)) - parseFloat(jsonData.batteryDischarge.slice(0, -2))) + "kWh");    
        } catch(error) {
            args.error("Failed to set solar capabilities", error);
        }
    }

    activateFlowCards(args) {
        args.log("Activate flow cards");
        
        args.registerCapabilityListener('real_time_solar', (value) => {
            args.log('Changes to :', value);
        });

        args.registerCapabilityListener('measure_battery', (value) => {
            args.log('Changes to :', value);
        });

        args.registerCapabilityListener('total_load_active_power', (value) => {
            args.log('Changes to :', value);
        });
    }
}

module.exports = SolarModule;