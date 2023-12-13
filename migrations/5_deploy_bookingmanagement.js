const BookingManagement = artifacts.require("BookingManagement");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(BookingManagement);
};
