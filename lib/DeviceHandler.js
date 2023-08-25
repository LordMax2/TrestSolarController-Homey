const Homey = require('homey');
const HttpHandler = require('HttpHandler.js');

class DeviceHandler extends Homey.Device {
  async Init() {
    // Call httpGetSolarHistory immediately when the device is initialized
    await this.httpGetSolarHistory(this.getStoreValue("address"));

    // Set up an interval to call httpGetSolarHistory every 30 seconds
    this.solarHistoryInterval = setInterval(async () => {
      try {
        await this.httpGetSolarHistory(this.getStoreValue("address"));
        this.log("Updated battery status");
      } catch (error) {
        this.error('Failed to fetch solar history:', error);
      }
    }, 30000);
  }

  async httpSetEnergyMode(energyMode) {
    const httpHandler = new HttpHandler();

    const options = {
      hostname: this.getStoreValue("address"),
      port: 7299,
      path: `/api/v1/solar/CreateSolarHistoryAndSetEnergyProfile/${energyMode}`,
      method: 'POST',
      rejectUnauthorized: false // Allow self-signed certificates
    };

    try {
      const jsonData = JSON.parse(await httpHandler.sendHttpRequest(options));
    } catch (error) {

    }
  } 

  async httpSetEnergyMode(energyMode) {
    const httpHandler = new HttpHandler();

    const options = {
      hostname: this.getStoreValue("address"),
      port: 7299,
      path: `/api/v1/solar/CreateSolarHistoryAndSetEnergyProfile/${energyMode}`,
      method: 'POST',
      rejectUnauthorized: false // Allow self-signed certificates
    };

    try {
      const jsonData = JSON.parse(await httpHandler.sendHttpRequest(options));
    } catch (error) {

    }
  }

  async httpGetSolarHistory(ipAddress) {
    const options = {
      hostname: ipAddress,
      port: 7299,
      path: '/api/v1/solar/GetLatestSolarHistory',
      method: 'GET',
      rejectUnauthorized: false // Allow self-signed certificates
    };

    try {
      const jsonData = JSON.parse(await this.sendHttpRequest(options));
 
      if (jsonData) {
        this.setSolarHistoryCapabilites(jsonData);
      } else {
        this.error('Solar history data not available');
      }
    } catch (error) {
      this.error('Failed to fetch solar history:', error);
    }
  }

  setSolarHistoryCapabilites(jsonData) {
    this.setCapabilityValue('real_time_solar', jsonData.realtimeSolar);
    this.setCapabilityValue('measure_battery', parseInt(jsonData.batteryCapacity));
    this.setCapabilityValue('total_load_active_power', jsonData.totalLoadActivePower);
    this.setCapabilityValue('battery_charging', parseFloat(parseFloat(jsonData.batteryCharge.slice(0, -2)) - parseFloat(jsonData.batteryDischarge.slice(0, -2))) + "kWh");
  }

  async discoverDevice() {
    
  }
}

module.exports = DeviceHandler;