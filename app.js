'use strict';

const Homey = require('homey');

class KlevebrandSolarControllerApp extends Homey.App {
  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('Klevebrand Solar Controller app has been initialized');
  }
}

module.exports = KlevebrandSolarControllerApp;
