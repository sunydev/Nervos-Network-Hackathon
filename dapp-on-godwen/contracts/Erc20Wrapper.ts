import Web3 from 'web3';
import * as ERC20JSON from '../../../build/contracts/ERC20.json';
import { ERC20 } from '../../types/ERC20';


const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

const SUDT_ID = '1606'; // Replace this with SUDT ID received from depositing SUDT to Layer 2. This should be a number.
const SUDT_NAME = 'MyToken';
const SUDT_SYMBOL = 'MTK';
const SUDT_TOTAL_SUPPLY = 9999999999;

export class Erc20Wrapper {
    web3: Web3;

    contract: ERC20;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(ERC20JSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getBalance(fromAddress:string)
{
   const data = await this.contract.methods.getBalance().call({ from: fromAddress });
return parseInt(data, 10);
}



async deploy(fromAddress: string) {
        const contract = await (this.contract
            .deploy({
                data: ERC20JSON.bytecode,
                arguments: [SUDT_NAME, SUDT_SYMBOL, SUDT_TOTAL_SUPPLY, SUDT_ID]
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress,
            } as any) as any);

        this.useDeployed(contract._address);
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }


}
