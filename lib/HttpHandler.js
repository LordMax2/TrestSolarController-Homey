const https = require('https');
const net = require('net');
const os = require('os');

class HttpHandler {
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
}

module.exports = HttpHandler;