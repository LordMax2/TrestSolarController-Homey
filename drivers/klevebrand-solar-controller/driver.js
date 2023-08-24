'use strict';

const { Driver } = require('homey');
const net = require('net');
const os = require('os');

class MyDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('Klevebrand Solar Controller has been initialized!');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    this.log("Searching for device...");
    const localIp = this.getLocalIpAddress();
    const subnet = localIp.split('.').slice(0, 3).join('.');

    var deviceIp = await this.findFirstSuccessfulConnection(2, 254, 7299, subnet);

    this.log(`Found device with ip address: ${deviceIp}`);

    return [
      {
        name: 'Klevebrand Solar Controller',
        data: {
          id: 'klevebrand-solar-controller'
        },
        store: {
          address: deviceIp
        }
      }
    ];
  }

  getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName of Object.keys(interfaces)) {
      for (const iface of interfaces[interfaceName]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
    return null;
  }

  async findFirstSuccessfulConnection(start, end, port, subnet) {
    const promises = [];
  
    for (let i = start; i <= end; i++) {
      const ipAddress = `${subnet}.${i}`;
      promises.push(this.testTCPConnection(ipAddress, port));
    }
  
    return Promise.any(promises).then((value) => {
      console.log("Successful connection to: " + value);
      return value; // Return the resolved value
    }).catch((error) => {
      console.log("No successful connections found.");
      return null; // Return null if all promises are rejected
    });
  }
  
  async testTCPConnection(ipAddress, port) {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
  
      socket.setTimeout(1000); // Set a timeout for the connection attempt
  
      socket.connect(port, ipAddress, () => {
        console.log(`Successful TCP connection to ${ipAddress}:${port}`);
        resolve(ipAddress);          
      });

      socket.on('error', () => { 

      });
  
      socket.on('timeout', () => {

      });

    });
  } 
}

module.exports = MyDriver;
