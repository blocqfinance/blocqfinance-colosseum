import path from 'node:path';
import fs from 'node:fs';
import solc from 'solc';
import { findImports } from './findImport';

export function compileContract(contractFile: string, contractName: string) {
    const filePath = path.resolve(__dirname, '../contracts', contractFile);
    const source = fs.readFileSync(filePath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            [contractFile]: { content: source },
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
    const contract = output.contracts[contractFile][contractName];

    // Extract ABI + bytecode for LetterOfCredit
    const artifact = {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object,
    };

    fs.writeFileSync(
        path.join(__dirname, '../artifacts/LetterOfCredit.json'),
        JSON.stringify(artifact, null, 2),
    );

    return artifact;
}
