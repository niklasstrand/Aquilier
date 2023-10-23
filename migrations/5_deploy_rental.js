const Rental = artifacts.require("Rental");
const IdentityManagement = artifacts.require("IdentityManagement");

module.exports = async function(deployer, network, accounts) {
    // Assuming IdentityManagement is already deployed
    const identityManagementInstance = await IdentityManagement.deployed();
    
    // Deploying the Rental contract with the address of the deployed IdentityManagement contract
    await deployer.deploy(Rental, identityManagementInstance.address);
};
