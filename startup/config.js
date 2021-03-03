const config = require("config");
module.exports = function () {
    
    if (!config.get("privateKey")) {
      console.log("FATAL ERROR: privateKey is not defined ");
      process.exit(1);
    }
}