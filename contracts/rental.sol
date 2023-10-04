// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Rental{

    struct Participant {
        address walletAddress;
        string name;
        string phone;
        string email;
        string physicalAddress;
        bool isOwner;
    }
    
    struct Property {
        address ownerAddress;
        string name;
        string location;
        uint256 rentalPrice;
        bool isAvailable;
    }
    
    mapping(address => Participant) public participants;
    mapping(uint256 => Property) public properties;
    
    uint256 public nextPropertyId;

    event PropertyCreated(
        uint256 propertyId,
        string name,
        string location,
        uint256 rentalPrice
    );

    modifier onlyOwner() {
        require(participants[msg.sender].isOwner, "Not an owner");
        _;
    }
    
    function addParticipant(
        string memory _name,
        string memory _phone,
        string memory _email,
        string memory _physicalAddress,
        bool _isOwner
    ) public {
        participants[msg.sender] = Participant(msg.sender, _name, _phone, _email, _physicalAddress, _isOwner);
    }
    
    function createProperty(
        string memory _name,
        string memory _location,
        uint256 _rentalPrice
    ) public onlyOwner returns(uint256) {
        properties[nextPropertyId] = Property(msg.sender, _name, _location, _rentalPrice, true);
        
        emit PropertyCreated(nextPropertyId, _name, _location, _rentalPrice);
        
        nextPropertyId++;
        return nextPropertyId - 1;
    }
}
