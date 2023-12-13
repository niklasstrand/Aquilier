const UserArtifact = artifacts.require("UserRegistry");

contract("UserArtifact", (accounts) => {

    let UserContract;
    before(async () => {
        UserContract = await UserArtifact.deployed();
    });
    
    it.skip("Should insert a new User and check all the data", async () => {
        await UserContract.addUser(
            "niklas", // name
            "1234567890", // phone
            "niklas@example.com", // email
            "123 Example St", // physicalAddress
            { from: accounts[0] }
        );
    
        const userDetails = await UserContract.getMyUserDetails({ from: accounts[0] });
        
        let expectedDID = web3.utils.keccak256(accounts[0]);
        
        console.log("User DID:", userDetails.did);
        console.log("Expected DID:", expectedDID);
        
        assert.equal(userDetails.name, "niklas", "The name should have been niklas");
        assert.equal(userDetails.did, expectedDID, "The DID should have matched");
    });
    
});

