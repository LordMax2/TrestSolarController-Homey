'use strict';

const { Device } = require('homey');
const SolarModule = require('../../lib/SolarModule.js');
const TrestSolarModule = require('../../lib/modules/TrestSolarModule.js');

class TrestSolarControllerDevice extends Device {
  async onInit() {
    this.solarModule = new SolarModule();
    await this.customInit();
  }

  async customInit() {
    this.solarModule.registerCapabilityListeners(this);
    this.solarModule.activateTriggerFlowCards(this);
    //this.solarModule.activateConditionFlowCards(this);
    this.solarModule.activateActionFlowCards(this);
    await this.solarModule.Init(this);
    await this.solarModule.InitButtons(this);

    this.log('Trest Solar Controller device has been initialized');
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
    this.solarModule = new SolarModule();
    this.setSettings(newSettings);
    await this.customInit();
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
