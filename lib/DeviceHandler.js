const Homey = require('homey');

class DeviceHandler extends Homey.Device {
  async getLatestSolarHistory(ipAddress) {
    try {
        const response = await Homey.http.get(`https://${ipAddress}:7299/api/v1/solar/GetLatestSolarHistory`);
  
        if (response.statusCode === 200) {
          const data = response.json;
          return data;
        } else {
          throw new Error('Failed to get solar history');
        }
      } catch (error) {
        throw error;
      }
  }
}

module.exports = DeviceHandler;