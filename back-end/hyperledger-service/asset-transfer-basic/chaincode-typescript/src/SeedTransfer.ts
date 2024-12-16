
import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { Seed } from './Seed';


/*key use
Farmer-Specific Seed Data: If I only used ${farmerId}, it would not differentiate between different types of seeds for the same farmer.
For example, if a farmer has multiple types of seeds (e.g., Wheat, Rice, etc.),
using just ${farmerId} would result in overwriting or confusion because the key would not distinguish between different seed types.
*/
@Info({ title: 'SeedTransfer', description: 'Smart contract for trading Seeds' })
export class SeedTransferContract extends Contract {

    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        const Seeds: Seed[] = [
            {

                farmerId: 'farmer1',
                SeedType: 'Wheat',
                quantity: 100,
                pricePerUnit: 10,
                location: 'Farm1',
            },
            {

                farmerId: 'farmer2',
                SeedType: 'Corn',
                quantity: 200,
                pricePerUnit: 8,
                location: 'Farm2',
            },
            {

                farmerId: 'farmer3',
                SeedType: 'Rice',
                quantity: 150,
                pricePerUnit: 12,
                location: 'Farm3',
            },
            {

                farmerId: 'farmer4',
                SeedType: 'Soybean',
                quantity: 120,
                pricePerUnit: 9,
                location: 'Farm4',
            },
            {
                docType: 'Seed',
                farmerId: 'farmer5',
                SeedType: 'Barley',
                quantity: 180,
                pricePerUnit: 11,
                location: 'Farm5',
            },
            {
                docType: 'Seed',
                farmerId: 'farmer6',
                SeedType: 'Oats',
                quantity: 90,
                pricePerUnit: 7,
                location: 'Farm6',
            },
        ];

        for (const seed of Seeds) {
            seed.docType = 'Seed';
            // Store the seed data in a deterministic order
            await ctx.stub.putState(`${seed.farmerId}-${seed.SeedType}`, Buffer.from(stringify(sortKeysRecursive(seed))));
            console.info(`Seed ${seed.farmerId}-${seed.SeedType} initialized`);
        }
    }

    // CreateSeed issues a new Seed to the world state with given details.
    @Transaction()
    public async CreateSeed(ctx: Context, farmerId: string, SeedType: string, quantity: number, pricePerUnit: number, location: string): Promise<void> {
        const exists = await this.SeedExists(ctx, farmerId, SeedType);
        if (exists) {
            throw new Error(`The Seed ${SeedType} already exists for Farmer ${farmerId}`);
        }

        // Create the Seed object
        const seed = {
            farmerId: farmerId,
            SeedType: SeedType,
            quantity: quantity,
            pricePerUnit: pricePerUnit,
            location: location
        };

        // Store the seed in world state
        await ctx.stub.putState(`${farmerId}-${SeedType}`, Buffer.from(stringify(sortKeysRecursive(seed))));
    }

    // ReadSeed returns the Seed stored in the world state with given farmerId and SeedType.
    @Transaction(false)
    public async ReadSeed(ctx: Context, farmerId: string, SeedType: string): Promise<string> {
        const seedJSON = await ctx.stub.getState(`${farmerId}-${SeedType}`); // Get the seed from world state
        if (seedJSON.length === 0) {
            throw new Error(`The Seed ${SeedType} for Farmer ${farmerId} does not exist`);
        }
        return seedJSON.toString();
    }

    // UpdateSeed updates an existing Seed in the world state with provided parameters.
    @Transaction()
    public async UpdateSeed(ctx: Context, farmerId: string, SeedType: string, quantity: number, pricePerUnit: number, location: string): Promise<void> {
        const exists = await this.SeedExists(ctx, farmerId, SeedType);
        if (!exists) {
            throw new Error(`The Seed ${SeedType} for Farmer ${farmerId} does not exist`);
        }

        // Create the updated Seed object
        const updatedSeed = {
            farmerId: farmerId,
            SeedType: SeedType,
            quantity: quantity,
            pricePerUnit: pricePerUnit,
            location: location
        };

        // Store the updated seed in world state
        await ctx.stub.putState(`${farmerId}-${SeedType}`, Buffer.from(stringify(sortKeysRecursive(updatedSeed))));
    }

    @Transaction()
    public async DeleteSeed(ctx: Context, farmerId: string, SeedType: string): Promise<void> {
        const exists = await this.SeedExists(ctx, farmerId, SeedType);
        if (!exists) {
            throw new Error(`The Seed ${SeedType} for Farmer ${farmerId} does not exist`);
        }
        await ctx.stub.deleteState(`${farmerId}-${SeedType}`);
    }

    // SeedExists checks if a seed exists in the world state with the given farmerId and SeedType.
    @Transaction(false)
    @Returns('boolean')
    public async SeedExists(ctx: Context, farmerId: string, SeedType: string): Promise<boolean> {
        const seedJSON = await ctx.stub.getState(`${farmerId}-${SeedType}`);
        return seedJSON.length > 0; // Returns true if the seed exists
    }

    // First TransferSeed: Updates the owner (farmerId) of a seed from one farmer to another.
    @Transaction()
    public async TransferSeedOwner(ctx: Context, farmerId: string, newFarmerId: string, SeedType: string): Promise<string> {
        const seedString = await this.ReadSeed(ctx, farmerId, SeedType);
        const seed = JSON.parse(seedString) as Seed;
        const oldOwner = seed.farmerId; // Store the old owner (farmerId)
        seed.farmerId = newFarmerId; // Update the owner (farmerId)

        // Save the updated seed information in world state
        await ctx.stub.putState(`${newFarmerId}-${SeedType}`, Buffer.from(stringify(sortKeysRecursive(seed))));

        // Delete the old seed record to prevent duplication
        await ctx.stub.deleteState(`${oldOwner}-${SeedType}`);

        await this.logHistory(ctx, `${farmerId}-${SeedType}`, 'TRANSFER', { from: oldOwner, to: newFarmerId });
        return oldOwner;
    }

    private async logHistory(ctx: Context, key: string, action: string, seedData: any): Promise<void> {
        const historyEntry = {
            timestamp: new Date().toISOString(),
            action,
            seedData
        };

        // Store the history in a separate audit log collection or append to the state
        await ctx.stub.putState(`${key}-history-${Date.now()}`, Buffer.from(stringify(sortKeysRecursive(historyEntry))));
    }

    public async TransferSeedQuantity(
        ctx: Context,
        farmerId: string,
        newFarmerId: string,
        SeedType: string,
        quantity: number
    ): Promise<void> {
        const farmerSeedKey = `${farmerId}-${SeedType}`;
        const farmerSeedString = await ctx.stub.getState(farmerSeedKey);

        if (!farmerSeedString.length) {
            throw new Error(`Farmer ${farmerId} does not own seeds of type ${SeedType}`);
        }

        const farmerSeed = JSON.parse(farmerSeedString.toString()) as Seed;

        if (farmerSeed.quantity < quantity) {
            throw new Error(`Farmer ${farmerId} does not have enough ${SeedType} seeds to transfer`);
        }

        farmerSeed.quantity -= quantity;
        await ctx.stub.putState(farmerSeedKey, Buffer.from(stringify(sortKeysRecursive(farmerSeed))));

        const newFarmerSeedKey = `${newFarmerId}-${SeedType}`;
        let newFarmerSeed: Seed | null = null;

        try {
            const newFarmerSeedString: Uint8Array = await ctx.stub.getState(newFarmerSeedKey);
            if (newFarmerSeedString.length > 0) {
                newFarmerSeed = JSON.parse(Buffer.from(newFarmerSeedString).toString()) as Seed;
            }
        } catch (error) {

            newFarmerSeed = null;
        }

        if (!newFarmerSeed) {
            newFarmerSeed = {
                farmerId: newFarmerId,
                SeedType: SeedType,
                quantity: quantity,
                pricePerUnit: farmerSeed.pricePerUnit,
                location: farmerSeed.location
            };
        } else {
            newFarmerSeed.quantity += quantity;
        }

        await ctx.stub.putState(newFarmerSeedKey, Buffer.from(stringify(sortKeysRecursive(newFarmerSeed))));

        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.info(`Transferred ${quantity} of ${SeedType} from ${farmerId} to ${newFarmerId}`);
    }



    @Transaction(false)
    @Returns('string')
    public async GetSeedHistory(ctx: Context, farmerId: string, SeedType: string): Promise<string> {
        const key = `${farmerId}-${SeedType}`;
        const iterator = await ctx.stub.getHistoryForKey(key);
        const history = [];
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            history.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(history);
    }

    // GetAllSeeds returns all Seeds found in the world state.
    @Transaction(false)
    @Returns('string')
    public async GetAllSeeds(ctx: Context): Promise<string> {
        const allResults = [];
        // Range query with empty string for startKey and endKey to query all seeds in world state.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue) as Seed;
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}
