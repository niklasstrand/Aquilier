import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import RentalABI from '../contracts/Rental.abi.json'


const web3 = new Web3('http://127.0.0.1:7545'); // Connect to Ganache.

const RentalComponent: React.FC = () => { 

    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0] || null);
        };
        init();
    }, []);

    const [participantName, setParticipantName] = useState("");
    const [participantPhone, setParticipantPhone] = useState("");
    const [participantEmail, setParticipantEmail] = useState("");
    const [participantPhysicalAddress, setParticipantPhysicalAddress] = useState("");
    const [isOwner, setIsOwner] = useState(false);  // for checkbox input
    const [isRenter, setIsRenter] = useState(false);  // for checkbox input
    
    const addParticipant = async () => {
        if(!account) return;
    
        const contract = new web3.eth.Contract(RentalABI, '0x9e3846bCD4B87977023815c3b6d028F2FcfA48e5');
        
        try {
            await (contract.methods.addParticipant as any)(
                participantName, 
                participantPhone, 
                participantEmail, 
                participantPhysicalAddress, 
                isOwner, 
                isRenter
                ).send({ from: account });
                
                alert("Participant added!");
            } catch (error) {
                console.error("An error occurred:", error);
                alert("Error while adding participant!");
            }
        };
        
        return (
            <div>
            <h2>Rental Contract Interaction</h2>
                <p>Explore and list properties for rent on the blockchain.</p>
            <input 
                type="text" 
                placeholder="Name" 
                value={participantName} 
                onChange={e => setParticipantName(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Email" 
                value={participantEmail} 
                onChange={e => setParticipantEmail(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Phone" 
                value={participantPhone} 
                onChange={e => setParticipantPhone(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Physical Address" 
                value={participantPhysicalAddress} 
                onChange={e => setParticipantPhysicalAddress(e.target.value)}
            />
            <label>
                Is Owner?
                <input 
                    type="checkbox"
                    checked={isOwner}
                    onChange={e => setIsOwner(e.target.checked)}
                />
            </label>
            <label>
                Is Renter?
                <input 
                    type="checkbox"
                    checked={isRenter}
                    onChange={e => setIsRenter(e.target.checked)}
                />
            </label>
            <button onClick={addParticipant}>Add Participant</button>
        </div>
    );
};

export default RentalComponent;




