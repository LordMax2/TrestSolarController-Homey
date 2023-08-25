const HttpHandler = require('./HttpHandler.js');

class DeviceHandler {
  async Init(args) {
    // Call httpGetSolarHistory immediately when the device is initialized
    await this.httpGetSolarHistory(args);

    // Set up an interval to call httpGetSolarHistory every 30 seconds
    this.solarHistoryInterval = setInterval(async () => {
      try {
        await this.httpGetSolarHistory(args);
        args.log("Updated battery status");
      } catch (error) {
        args.error('Failed to fetch solar history:', error);
      }
    }, 30000);
  }

  async InitButtons(args) {
    args.registerCapabilityListener('sell_button', this.httpSetEnergyMode.bind(args, 5));
    args.registerCapabilityListener('buy_button', this.httpSetEnergyMode.bind(args, 4));
    args.registerCapabilityListener('self_sufficient_button', this.httpSetEnergyMode.bind(args, 1));
    args.registerCapabilityListener('pause_button', this.httpSetEnergyMode.bind(args, 6));
  }

  async httpSetEnergyMode(args, energyMode) {
    const httpHandler = new HttpHandler();

    const options = {
      hostname: args.getStoreValue("address"),
      port: 7299,
      path: `/api/v1/solar/CreateSolarHistoryAndSetEnergyProfile/${energyMode}`,
      method: 'POST',
      rejectUnauthorized: false // Allow self-signed certificates
    };

    try {
      const jsonData = JSON.parse(await httpHandler.sendHttpRequest(options));
    } catch (error) { }
  } 

  async httpSetEnergyMode(args, energyMode) {
    const httpHandler = new HttpHandler();

    const options = {
      hostname: args.getStoreValue("address"),
      port: 7299,
      path: `/api/v1/solar/CreateSolarHistoryAndSetEnergyProfile/${energyMode}`,
      method: 'POST',
      rejectUnauthorized: false // Allow self-signed certificates
    };

    try {
      const jsonData = JSON.parse(await httpHandler.sendHttpRequest(options));
    } catch (error) { }
  }

  async httpGetSolarHistory(args) {
    const httpHandler = new HttpHandler();

    const options = {
      hostname: args.getStoreValue("address"),
      port: 7299,
      path: '/api/v1/solar/GetLatestSolarHistory',
      method: 'GET',
      rejectUnauthorized: false // Allow self-signed certificates
    };

    try {
      const jsonData = JSON.parse(await httpHandler.sendHttpRequest(options));
 
      if (jsonData) {
        this.setSolarHistoryCapabilites(args, jsonData);
      } else {
        args.error('Solar history data not available');
      }
    } catch (error) {
      args.error('Failed to fetch solar history:', error);
    }
  }

  setSolarHistoryCapabilites(args, jsonData) {
    args.setCapabilityValue('real_time_solar', jsonData.realtimeSolar);
    args.setCapabilityValue('measure_battery', parseInt(jsonData.batteryCapacity));
    args.setCapabilityValue('total_load_active_power', jsonData.totalLoadActivePower);
    args.setCapabilityValue('battery_charging', parseFloat(parseFloat(jsonData.batteryCharge.slice(0, -2)) - parseFloat(jsonData.batteryDischarge.slice(0, -2))) + "kWh");
  }

  async discoverDevice() {
    const httpHandler = new HttpHandler();

    const localIp = httpHandler.getLocalIpAddress();
    const subnet = localIp.split('.').slice(0, 3).join('.');

    var deviceIp = await httpHandler.findFirstSuccessfulConnection(2, 254, 7299, subnet);
    return deviceIp;
  }
}

module.exports = DeviceHandler;