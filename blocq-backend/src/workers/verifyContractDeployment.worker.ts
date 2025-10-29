import { main as verifyOnEtherScan } from '../../scripts/verify';

async function handler(job: { deadline: number; contractAddress: string }) {
    try {
        const result: Record<string, string> = await verifyOnEtherScan(
            job.deadline,
            job.contractAddress,
        );
        process.send?.(result);
    } catch (err) {
        process.send?.(err);
    } finally {
        process.off('message', handler);
        process.exit(0);
    }
}

process.on('message', handler);
