const Rental = artifacts.require("Rental");
const IdentityManagement = artifacts.require("IdentityManagement");


contract("Rental", (accounts) => {

    let identityManagementInstance;
    let RentalInstance;
    before(async () => {
        RentalInstance = await Rental.deployed();
        identityManagementInstance = await IdentityManagement.deployed();
    });
    

    it("Should insert a new User and check all the data", async () => {
        await RentalInstance.addUser(
            "niklas", // name
            "1234567890", // phone
            "niklas@example.com", // email
            "123 Example St", // physicalAddress
            true, // isOwner
            false, // isRenter
            { from: accounts[0] }
        );
    
        const userDetails = await RentalInstance.getMyUserDetails({ from: accounts[0] });
        
        let expectedDID = web3.utils.keccak256(accounts[0]);
        
        console.log("User DID:", userDetails.did);
        console.log("Expected DID:", expectedDID);
        
        assert.equal(userDetails.name, "niklas", "The name should have been niklas");
        assert.equal(userDetails.did, expectedDID, "The DID should have matched");
    });

    it("User should not be able to create a property on somone else address", async () => {
        // Try creating a property without being registered as an owner
        try {
            await RentalInstance.createProperty(
                "Invalid Property",
                "Invalid Location",
                1000,
                { from: accounts[1] }  // Non-owner account
            );
            assert.fail("The transaction should have reverted");
        } catch (error) {
            assert.include(
                error.message,
                "revert Not an owner",
                "The error message should contain 'revert Not an owner'"
            );
        }
    });

    it("Owner should be able to create a property", async () => {
        // First, ensure the user (accounts[0]) is an owner.
        // Assuming you have a function in your contract that can check this.
        const userDetails = await RentalInstance.getMyUserDetails({ from: accounts[0] });

        assert.isTrue(userDetails.isOwner, "The account should be an owner");

        // Creating a property as an owner
        const tx = await RentalInstance.createProperty(
            "Aurora Sunset",
            "Vangberg 3f",
            1000,
            { from: accounts[0] }
        );

        // Now, check if the property was indeed created
        // Assuming you have a function to retrieve property details in your contract.
        const propertyDetails = await RentalInstance.getMyPropertyDetails();
        console.log("Property details: ", propertyDetails);

        assert.equal(propertyDetails.name, "Aurora Sunset", "The property name should match");
        assert.equal(propertyDetails.location, "Vangberg 3f", "The property address should match");
        assert.equal(propertyDetails.dailyRate, 1000, "The property price should match");
    });
    
});

