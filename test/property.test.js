
const PropertyArtifact = artifacts.require("PropertyManager");
const UserArtifact = artifacts.require("UserRegistry");
contract("Property and User Registry tests", (accounts) => {

    let PropertyContract;
    let UserContract;
    before(async () => {
        PropertyContract = await PropertyArtifact.deployed();
        UserContract = await UserArtifact.deployed();
    });
    

    it.skip("Owner should be able to create a property", async () => {
        // Send a transaction to create a new property
        const tx = await PropertyContract.createProperty(
            "Aurora Sunset",
            "Vangberg 3f",
            1000,
            { from: accounts[0] }
        );
    
        // The logs are part of the transaction receipt, which is the result of the transaction in Truffle
        const propertyCreatedEvent = tx.logs.find(log => log.event === "PropertyCreated");
        // Make sure that the event was actually found
        assert.ok(propertyCreatedEvent, "PropertyCreated event should be emitted");
    
        // Get the property ID from the event
        const propertyId = propertyCreatedEvent.args.propertyId.toNumber(); // Convert BigNumber to a number if necessary
    
        // Now, check if the property was indeed created
        const propertyDetails = await PropertyContract.properties(propertyId);
    
        // Perform assertions
        assert.equal(propertyDetails.name, "Aurora Sunset", "The property name should match");
        assert.equal(propertyDetails.location, "Vangberg 3f", "The property address should match");
        assert.equal(propertyDetails.dailyRate.toString(), '1000', "The property price should match"); // Use toString() in case it's a BigNumber
    });
    
    
});



