import { letterOfCreditService } from '../src/services/letterOfCredit.service';
import fs from 'node:fs';
import path from 'node:path';

export async function main(deadline: number) {
    const contractAddress =
        await letterOfCreditService.deployContract(deadline);

    console.log('Contract deployed at:', contractAddress);

    // fs.writeFileSync(
    //     path.join(__dirname, '../artifacts/deployment.json'),
    //     JSON.stringify(contractAddress, null, 2),
    // );
}
