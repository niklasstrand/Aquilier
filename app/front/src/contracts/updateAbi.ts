import fs from 'fs';

// Define paths
const compiledContractPath = '../build/contracts/Rental.json';
const frontendAbiPath = '../app/front/src/contracts/Rental.abi.json';

try {
    // Read compiled contract
    const compiledContract = JSON.parse(fs.readFileSync(compiledContractPath, 'utf8'));
    
    // Write ABI to frontend directory
    fs.writeFileSync(
        frontendAbiPath,
        JSON.stringify(compiledContract.abi, null, 2)
    );

    console.log('ABI updated successfully!');
} catch (error: any) {
    console.error('Error updating ABI:', error.message);
}


