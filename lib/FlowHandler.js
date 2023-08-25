const DeviceHandler = require('../../lib/DeviceHandler.js');

class FlowHandler {
  async Init(args) {
    const deviceHandler = new DeviceHandler();
    
    const sellCard = args.homey.flow.getActionCard('sell-mode');
    sellCard.registerRunListener(async (args) => {
      deviceHandler.httpSetEnergyMode(args, 5);
    });

    const buyCard = args.homey.flow.getActionCard('buy-mode');
    buyCard.registerRunListener(async (args) => {
      deviceHandler.httpSetEnergyMode(args, 4);
    });

    const selfSufficientCard = args.homey.flow.getActionCard('self-sufficient-mode');
    selfSufficientCard.registerRunListener(async (args) => {
      deviceHandler.httpSetEnergyMode(args, 1);
    });
    
    args.log("Initialized flows");
  }
}

module.exports = FlowHandler;