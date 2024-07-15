'use strict';

const Homey = require('homey');

class TrestSolarControllerApp extends Homey.App {
  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('Trest Solar Controller app has been initialized');
  }
}

module.exports = TrestSolarControllerApp;
