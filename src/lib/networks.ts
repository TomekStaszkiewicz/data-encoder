import { get, writable } from "svelte/store";

export enum Networks {
    Mainnet = 'mainnet',
    Rinkeby = 'rinkeby'
}

const prefixes = {
    [Networks.Mainnet]: 'api',
    [Networks.Rinkeby]: 'api-rinkeby'
};

const linkPrefixes = {
    [Networks.Mainnet]: '',
    [Networks.Rinkeby]: 'rinkeby.'
};

export const network = writable(Networks.Mainnet);

export const getEtherscanAbiEndpoint = (contractAddress: string, etherscanKey: string) => {
    const prefix = prefixes[get(network)];
    return `https://${prefix}.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${etherscanKey}`;
}

export const getEtherscanLink = (contractAddress: string) => {
    const prefix = linkPrefixes[get(network)];
    return `https://${prefix}etherscan.io/address/${contractAddress}`;
}
