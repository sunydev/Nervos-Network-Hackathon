import Web3 from 'web3';
import * as SimpleStorageJSON from '../../../build/contracts/SimpleStorage.json';
import { SimpleStorage } from '../../types/SimpleStorage';


const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

export class SimpleStorageWrapper {
    web3: Web3;

    contract: SimpleStorage;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(SimpleStorageJSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getBalance(fromAddress:string)
{
   const data = await this.contract.methods.getBalance().call({ from: fromAddress });
return parseInt(data, 10);
}

async payTrack(value:number,fromAddress:string)  {

const tx = await this.contract.methods.payTrack(value).send({
        ...DEFAULT_SEND_OPTIONS,
        from: fromAddress,
        value
    });

    return tx;
}

async deploy(fromAddress: string) {
        const contract = await (this.contract
            .deploy({
                data: SimpleStorageJSON.bytecode,
                arguments: []
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress
            } as any) as any);

        this.useDeployed(contract._address);
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }


}
