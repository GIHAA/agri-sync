import { Object, Property } from 'fabric-contract-api';

@Object()
export class Seed {
    @Property()
    public docType?: string = '';

    @Property()
    public farmerId: string = '';

    @Property()
    public SeedType: string = '';

    @Property()
    public quantity: number = 0;

    @Property()
    public pricePerUnit: number = 0;

    @Property()
    public location: string = '';

    // constructor(farmerId: string, SeedType: string, quantity: number, pricePerUnit: number, location: string, docType: string = 'Seed') {
    //     this.farmerId = farmerId;
    //     this.SeedType = SeedType;
    //     this.quantity = quantity;
    //     this.pricePerUnit = pricePerUnit;
    //     this.location = location;
    //     this.docType = docType;
    // }
}
