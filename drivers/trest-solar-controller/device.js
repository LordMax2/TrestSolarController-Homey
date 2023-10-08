'use strict';

const { Device } = require('homey');
const DeviceHandler = require('../../lib/DeviceHandler.js');

class TrestSolarControllerDevice extends Device {
  async onInit() {
    const deviceHandler = new DeviceHandler();

    await deviceHandler.Init(this);
    await deviceHandler.InitButtons(this);

    this.log('Trest Solar Controller device has been initialized');
    this.log('Ip address: ' + this.getStoreValue("address"));
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('Trest Solar Controller has been added');
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
    this.log('Trest Solar Controller device settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('Trest Solar Controller device was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('Trest Solar Controller device has been deleted');
  }

}

module.exports = TrestSolarControllerDevice;
