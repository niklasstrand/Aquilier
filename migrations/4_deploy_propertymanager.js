const UserRegistry = artifacts.require("UserRegistry");
const PropertyManager = artifacts.require("PropertyManager");

module.exports = async function(deployer) {
  await deployer.deploy(UserRegistry);
  const userRegistryInstance = await UserRegistry.deployed();
  
  await deployer.deploy(PropertyManager, userRegistryInstance.address);
};
