'use strict';

const { Device } = require('homey');
const https = require('https');

class MyDevice extends Device {
  async onInit() {
    this.registerCapabilityListener('sell_button', this.setEnergyMode.bind(this, 5));
    this.registerCapabilityListener('buy_button', this.setEnergyMode.bind(this, 4));
    this.registerCapabilityListener('self_sufficient_button', this.setEnergyMode.bind(this, 1));

    this.log('Klevebrand Solar Controller has been initialized');
    this.log('Ip address: ' + this.getStoreValue("address"));

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
    }, 30000); // 30 seconds in milliseconds
  }

  async setEnergyMode(energyMode) {
    await this.httpSetEnergyMode(energyMode);
  }

  async httpSetEnergyMode(energyMode) {
    const options = {
      hostname: this.getStoreValue("address"),
      port: 7299,
      path: `/api/v1/solar/CreateSolarHistoryAndSetEnergyProfile/${energyMode}`,
      method: 'POST',
      rejectUnauthorized: false // Allow self-signed certificates
    };

    try {
      const jsonData = JSON.parse(await this.sendHttpRequest(options));
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
        this.setCapabilityValue('real_time_solar', jsonData.realtimeSolar);
        this.setCapabilityValue('measure_battery', parseInt(jsonData.batteryCapacity));
        this.setCapabilityValue('total_load_active_power', jsonData.totalLoadActivePower);
        this.setCapabilityValue('battery_charging', parseFloat(parseFloat(jsonData.batteryCharge.slice(0, -2)) - parseFloat(jsonData.batteryDischarge.slice(0, -2))) + "kWh");
      } else {
        this.error('Battery capacity data not available');
      }
    } catch (error) {
      this.error('Failed to fetch solar history:', error);
    }
  }

  sendHttpRequest(options) {
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

      req.end();
    });
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('Klevebrand Solar Controller has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('Klevebrand Solar Controller settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('Klevebrand Solar Controller was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('Klevebrand Solar Controller has been deleted');
  }

}

module.exports = MyDevice;
