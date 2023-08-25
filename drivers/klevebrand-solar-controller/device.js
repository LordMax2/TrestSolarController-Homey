'use strict';

const { Device } = require('homey');
const DeviceHandler = require('../lib/DeviceHandler.js');

class MyDevice extends Device {
  async onInit() {
    const deviceHandler = new DeviceHandler();
    await deviceHandler.Init();

    this.registerCapabilityListener('sell_button', deviceHandler.httpSetEnergyMode.bind(this, 5));
    this.registerCapabilityListener('buy_button', deviceHandler.httpSetEnergyMode.bind(this, 4));
    this.registerCapabilityListener('self_sufficient_button', deviceHandler.httpSetEnergyMode.bind(this, 1));
    this.registerCapabilityListener('pause_button', deviceHandler.httpSetEnergyMode.bind(this, 6));

    this.log('Klevebrand Solar Controller has been initialized');
    this.log('Ip address: ' + this.getStoreValue("address"));
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
