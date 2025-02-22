import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import crypto from 'crypto';
import { Seed } from './Seed';

// Define the Seed interface
// interface Seed {
//     farmerId: string;
//     SeedType: string;
//     quantity: number;
//     pricePerUnit: number;
//     location: string;
//     transections: string[];
// }

@Info({ title: 'SeedTransfer', description: 'Smart contract for trading Seeds' })
export class SeedTransferContract extends Contract {
    // Repository functions for abstraction
    private async getSeedByKey(ctx: Context, key: string): Promise<Seed | null> {
        const seedJSON = await ctx.stub.getState(key);
        if (!seedJSON || seedJSON.length === 0) return null;
        return JSON.parse(seedJSON.toString()) as Seed;
    }

    private async saveSeed(ctx: Context, key: string, seed: Seed): Promise<void> {
        await ctx.stub.putState(key, Buffer.from(stringify(sortKeysRecursive(seed))));
    }

    private async deleteSeed(ctx: Context, key: string): Promise<void> {
        await ctx.stub.deleteState(key);
    }

    // Merkle Tree computation
    private async calculateMerkleRoot(ctx: Context): Promise<string> {
        const iterator = await ctx.stub.getStateByRange('', '');
        const hashes: string[] = [];
        let result = await iterator.next();

        while (!result.done) {
            const seed = result.value.value.toString();
            const hash = crypto.createHash('sha256').update(seed).digest('hex');
            hashes.push(hash);
            result = await iterator.next();
        }

        while (hashes.length > 1) {
            const temp: string[] = [];
            for (let i = 0; i < hashes.length; i += 2) {
                const hashPair = hashes[i] + (hashes[i + 1] || '');
                const combinedHash = crypto.createHash('sha256').update(hashPair).digest('hex');
                temp.push(combinedHash);
            }
            hashes.splice(0, hashes.length, ...temp);
        }

        return hashes[0] || '';
    }

    @Transaction(false)
    @Returns('string')
    public async GetMerkleRoot(ctx: Context): Promise<string> {
        return await this.calculateMerkleRoot(ctx);
    }

    // Initialize ledger with seed data
    @Transaction()
    public async InitLedger(ctx: Context): Promise<string> {
        const Seeds: Seed[] = [
            { farmerId: 'farmer1', SeedType: 'Wheat', quantity: 100, pricePerUnit: 10, location: 'Farm1', transectionIds: [] },
            { farmerId: 'farmer2', SeedType: 'Corn', quantity: 200, pricePerUnit: 8, location: 'Farm2', transectionIds: [] },
            { farmerId: 'farmer3', SeedType: 'Rice', quantity: 150, pricePerUnit: 12, location: 'Farm3', transectionIds: [] },
            { farmerId: 'farmer4', SeedType: 'Soybean', quantity: 120, pricePerUnit: 9, location: 'Farm4', transectionIds: [] },
            { farmerId: 'farmer5', SeedType: 'Barley', quantity: 180, pricePerUnit: 11, location: 'Farm5', transectionIds: [] },
            { farmerId: 'farmer6', SeedType: 'Oats', quantity: 90, pricePerUnit: 7, location: 'Farm6', transectionIds: [] }
        ];

        for (const seed of Seeds) {
            const key = `${seed.farmerId}-${seed.SeedType}`;
            seed.transectionIds.push(ctx.stub.getTxID());
            await this.saveSeed(ctx, key, seed);
        }

        return JSON.stringify({ message: 'Ledger initialized' });
    }

    @Transaction()
    public async CreateSeed(ctx: Context, farmerId: string, SeedType: string, quantity: number, pricePerUnit: number, location: string): Promise<string> {
        const key = `${farmerId}-${SeedType}`;
        const exists = await this.getSeedByKey(ctx, key);

        if (exists) {
            throw new Error(`The Seed ${SeedType} already exists for Farmer ${farmerId}`);
        }

        const seed: Seed = {
            farmerId,
            SeedType,
            quantity,
            pricePerUnit,
            location,
            transectionIds: [ctx.stub.getTxID()]
        };

        await this.saveSeed(ctx, key, seed);

        return stringify(seed);
    }

    @Transaction(false)
    @Returns('string')
    public async ReadSeed(ctx: Context, farmerId: string, SeedType: string): Promise<string> {
        const key = `${farmerId}-${SeedType}`;
        const seed = await this.getSeedByKey(ctx, key);

        if (!seed) {
            throw new Error(`The Seed ${SeedType} for Farmer ${farmerId} does not exist`);
        }

        return stringify(seed);
    }

    @Transaction()
    public async UpdateSeed(ctx: Context, farmerId: string, SeedType: string, quantity: number, pricePerUnit: number, location: string): Promise<void> {
        const key = `${farmerId}-${SeedType}`;
        const seed = await this.getSeedByKey(ctx, key);

        if (!seed) {
            throw new Error(`The Seed ${SeedType} for Farmer ${farmerId} does not exist`);
        }

        seed.quantity = quantity;
        seed.pricePerUnit = pricePerUnit;
        seed.location = location;
        seed.transectionIds.push(ctx.stub.getTxID());

        await this.saveSeed(ctx, key, seed);
    }

    @Transaction()
    public async DeleteSeed(ctx: Context, farmerId: string, SeedType: string): Promise<void> {
        const key = `${farmerId}-${SeedType}`;
        const seed = await this.getSeedByKey(ctx, key);

        if (!seed) {
            throw new Error(`The Seed ${SeedType} for Farmer ${farmerId} does not exist`);
        }

        await this.deleteSeed(ctx, key);
    }

    @Transaction()
    public async TransferSeedOwner(ctx: Context, farmerId: string, newFarmerId: string, SeedType: string): Promise<void> {
        const key = `${farmerId}-${SeedType}`;
        const seed = await this.getSeedByKey(ctx, key);

        if (!seed) {
            throw new Error(`The Seed ${SeedType} for Farmer ${farmerId} does not exist`);
        }

        const newKey = `${newFarmerId}-${SeedType}`;
        seed.farmerId = newFarmerId;
        seed.transectionIds.push(ctx.stub.getTxID());

        await this.saveSeed(ctx, newKey, seed);
        await this.deleteSeed(ctx, key);
    }

    @Transaction(false)
    @Returns('string')
    public async GetAllSeeds(ctx: Context): Promise<string> {
        const iterator = await ctx.stub.getStateByRange('', '');
        const results: Seed[] = [];

        let result = await iterator.next();
        while (!result.done) {
            const seed = JSON.parse(result.value.value.toString()) as Seed;
            results.push(seed);
            result = await iterator.next();
        }

        return JSON.stringify(results);
    }

    @Transaction(false)
    @Returns('string')
    public async GetSeedHistory(ctx: Context, farmerId: string, SeedType: string): Promise<string> {
        const key = `${farmerId}-${SeedType}`;
        const iterator = await ctx.stub.getHistoryForKey(key);
        const history = [];

        let result = await iterator.next();
        while (!result.done) {
            const record = JSON.parse(result.value.value.toString());
            history.push(record);
            result = await iterator.next();
        }

        return JSON.stringify(history);
    }
}
