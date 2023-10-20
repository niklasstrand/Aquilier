// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IdentityManagement.sol";

contract Rental{

    struct User {
        address userAddress;
        string name;
        string phone;
        string email;
        string physicalAddress;
        bool isOwner;
        bool isRenter;
        bytes32 did;  
    }
    
    mapping(address => User) public users;

    IdentityManagement public identityManagement;

    constructor(address _identityManagementAddress) {
        identityManagement = IdentityManagement(_identityManagementAddress);
    }
    function getMyUserDetails() public view returns (User memory) {
        return users[msg.sender];
    }
function addUser(
    string memory _name,
    string memory _phone,
    string memory _email,
    string memory _physicalAddress,
    bool _isOwner,
    bool _isRenter
) public {
    bytes32 _did = keccak256(abi.encodePacked(msg.sender));

    _addUserInternal(_name, _phone, _email, _physicalAddress, _isOwner, _isRenter, _did);
}

function addUser(
    string memory _name,
    string memory _phone,
    string memory _email,
    string memory _physicalAddress,
    bool _isOwner,
    bool _isRenter,
    bytes32 _did
) public {
    _addUserInternal(_name, _phone, _email, _physicalAddress, _isOwner, _isRenter, _did);
}

// Internal function to handle user addition
function _addUserInternal(
    string memory _name,
    string memory _phone,
    string memory _email,
    string memory _physicalAddress,
    bool _isOwner,
    bool _isRenter,
    bytes32 _did
) internal {
    // Adding user to the UserManagement contract
    users[msg.sender] = User(msg.sender, _name, _phone, _email, _physicalAddress, _isOwner, _isRenter, _did);
    
    // Registering DID to the IdentityManagement contract
    // identityManagement.registerTenant(_did);
}

    
    struct Property {
        address ownerAddress;
        string name;
        string location;
        uint256 dailyRate;
        bool isAvailable;
    }

    mapping(uint256 => Property) public properties;
    mapping(address => uint256) public ownerToPropertyId;


    uint256 public nextPropertyId;

    event PropertyCreated(
        uint256 propertyId,
        string name,
        string location,
        uint256 dailyRate
    );

    modifier onlyOwner() {
        require(users[msg.sender].isOwner, "Not an owner");
        _;
    }
        
    function createProperty(
        string memory _name,
        string memory _location,
        uint256 _dailyRate
    ) public onlyOwner returns(uint256) {
        properties[nextPropertyId] = Property(msg.sender, _name, _location, _dailyRate, true);
        
        // Map the msg.sender's address to the property ID if needed
        ownerToPropertyId[msg.sender] = nextPropertyId;
        
        emit PropertyCreated(nextPropertyId, _name, _location, _dailyRate);
        
        nextPropertyId++;
        return nextPropertyId - 1;  // Return the created property's ID
    }

    function getMyPropertyDetails() public view returns (Property memory) {
        uint256 propertyId = ownerToPropertyId[msg.sender];
        return properties[propertyId];
    }
}
