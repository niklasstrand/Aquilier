// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// A contract to manage the identity of tenants.
contract UserRegistry {

    struct User {
        address userAddress;
        string name;
        string phone;
        string email;
        string physicalAddress;
        bytes32 did;  
    }
    
    mapping(address => User) public users;

    function getMyUserDetails() public view returns (User memory) {
        return users[msg.sender];
    }
function addUser(
    string memory _name,
    string memory _phone,
    string memory _email,
    string memory _physicalAddress

) public {
    bytes32 _did = keccak256(abi.encodePacked(msg.sender));

    _addUserInternal(_name, _phone, _email, _physicalAddress, _did);
}


// Internal function to handle user addition
function _addUserInternal(
    string memory _name,
    string memory _phone,
    string memory _email,
    string memory _physicalAddress,
    bytes32 _did
) internal {
    // Adding user to the UserManagement contract
    users[msg.sender] = User(msg.sender, _name, _phone, _email, _physicalAddress, _did);
    
    // Registering DID to the IdentityManagement contract
    // identityManagement.registerTenant(_did);
}

    // Tenant struct to hold the Decentralized Identifier (DID) and Verifiable Credential (VC) of a tenant.
    struct Tenant {
        bytes32 did; // Decentralized Identifier for the tenant.
        bytes32 vc;  // Verifiable Credential for the tenant.
    }
    
    // Mapping from Ethereum addresses to their corresponding Tenant data.
    mapping(address => Tenant) public tenants;
    
    // Event emitted when a tenant is verified.
    event TenantVerified(address tenantAddress);

    // Function to register a tenant with their DID.
    // Only the DID is provided during registration; the VC will be added later during verification.
    function registerTenant(bytes32 did) public {
        tenants[msg.sender] = Tenant(did, bytes32(0)); // Set the DID and initialize VC to zero.
    }

    // Function to set the Verifiable Credential (VC) for a tenant.
    // This also acts as verifying the tenant.
    function setTenantVC(address tenantAddress, bytes32 vc) public {
        tenants[tenantAddress].vc = vc; // Set the VC for the tenant.
        emit TenantVerified(tenantAddress); // Emit an event indicating that the tenant has been verified.
    }
    
    // Check if a tenant has been verified.
    // A tenant is considered verified if they have a non-zero VC.
    function isTenantVerified(address tenantAddress) public view returns (bool) {
        return tenants[tenantAddress].vc != bytes32(0);
    }
}
