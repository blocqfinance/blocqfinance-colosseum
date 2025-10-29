import axios from 'axios';
import qs from 'qs';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { ethers } from 'ethers';
import { findImports } from './findImport';
import { CONSTANTS } from './constants';

dotenv.config();

export async function main(deadline: number, contractAddress: string) {
    const {
        etherscanApiUrl,
        etherscanChainId,
        etherscanApiKey,
        adminAddress,
        usdcAddress,
    } = CONSTANTS;

    const contractPath = path.resolve(
        __dirname,
        '../contracts/LetterOfCredit.sol',
    );
    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            'LetterOfCredit.sol': { content: source },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode'],
                },
            },
        },
    };

    const output = JSON.parse(
        solc.compile(JSON.stringify(input), { import: findImports }),
    );

    // encode constructor args
    const encodedConstructorArgs = ethers.AbiCoder.defaultAbiCoder()
        .encode(
            ['address', 'address', 'uint256'],
            [
                adminAddress, // same as deploy
                usdcAddress, // same as deploy
                deadline, // same deadline
            ],
        )
        .slice(2);

    const payload = {
        apikey: etherscanApiKey,
        chainid: etherscanChainId,
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: contractAddress,
        sourceCode: JSON.stringify(output), // full JSON input
        codeformat: 'solidity-standard-json-input',
        contractname: 'LetterOfCredit.sol:LetterOfCredit',
        compilerversion: 'v0.8.30+commit.73712a01', // must match the solc version
        optimizationUsed: 0,
        // runs: 200,
        constructorArguments: encodedConstructorArgs,
    };

    type EtherscanVerifyResponse = Record<string, string>;

    const resp = await axios.post<EtherscanVerifyResponse>(
        etherscanApiUrl,
        qs.stringify(payload),
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
    );

    return resp.data;
}
