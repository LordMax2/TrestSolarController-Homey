const Homey = require("homey");

class TrestSolarControllerDriver extends Homey.Driver {
  async onPair(session) {
    let username = "";
    let password = "";

    session.setHandler("login", async (data) => {
      username = data.username;
      password = data.password;
      
      return true;
    });

    session.setHandler("list_devices", async () => {
      const myDevices = [
        {
          name: "Trest Solar Controller",
          id: "trest-solar-controller"
        }
      ];

      const devices = myDevices.map((myDevice) => {
        return {
          name: myDevice.name,
          data: {
            id: myDevice.id,
          },
          settings: {
            username,
            password,
          },
        };
      });

      return devices;
    });
  }
}

module.exports = TrestSolarControllerDriver;