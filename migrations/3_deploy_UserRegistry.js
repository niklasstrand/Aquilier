const UserRegistry = artifacts.require("UserRegistry");

module.exports = function(deployer) {
  // Deploy the UserRegistry contract
  deployer.deploy(UserRegistry);
};
