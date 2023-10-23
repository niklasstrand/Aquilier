const Rental = artifacts.require("Rental");
const IdentityManagement = artifacts.require("BookingManagement");

module.exports = async function (deployer) {
    // Deploy the IdentityManagement contract
    await deployer.deploy(IdentityManagement);

    // Deploy the Rental contract, passing the address of the IdentityManagement contract to its constructor
    await deployer.deploy(Rental, IdentityManagement.address);
};
