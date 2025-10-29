import { fork } from 'node:child_process';
import path from 'node:path';

export function verifyContractDeploymentChildProcess(
    deadline: number,
    address: string,
) {
    // Start child process to verify on etherscan

    console.log('starting deployment verification');
    const workerPath = path.resolve(
        __dirname,
        '../workers/verifyContractDeployment.worker.ts',
    );
    const child = fork(workerPath, { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });

    // Send job data to worker
    child.send({ deadline, contractAddress: address });

    // Listen for response from worker
    child.on(
        'message',
        (msg: { error?: string; result?: Record<string, string> }) => {
            console.log('===== Completed verification =====:', msg);
        },
    );

    child.on('error', (err) => {
        console.error(
            'xxxxx Error encountered in deployment verification child process xxxxx: ',
            err,
        );
    });

    // Handle child process exit
    child.on('exit', (code) => {
        console.log(
            `Child process for verifying deployment exited with code ${code}`,
        );
    });
}
