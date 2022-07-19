<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import axios from 'axios';
	import {ethers} from 'ethers';
	import { onMount } from 'svelte';

	onMount(() => {
	 	etherscanKey = localStorage.getItem('etherscanKey') ?? '';
	 	infuraKey = localStorage.getItem('infuraKey') ?? '';
		contractAddress = localStorage.getItem('contractAddress') ?? '';
		methodName = localStorage.getItem('methodName') ?? '';
	});
	let contractAddress = '';
	let methodName = '';
	let newArg = '';
	let args: string[] = [];
	let etherscanKey = '';
	let infuraKey = '';
	let etherscanLink = '';

	let result = '';

	const onAddArgument = () => {
		args = [...args, newArg];
		newArg = '';
	}

	const clearArgs = () => {
		args = [];
	}

	const onEncodeData = async () => {
		localStorage.setItem('etherscanKey', etherscanKey);
		localStorage.setItem('infuraKey', infuraKey);
		localStorage.setItem('contractAddress', contractAddress);
		localStorage.setItem('methodName', methodName);
		
		const getAbiAddress = `https://api.etherscan.io/api
								?module=contract
								&action=getabi
								&address=${contractAddress}
								&apikey=${etherscanKey}`;
		const etherscanRes = await axios.get(getAbiAddress);
		const provider = new ethers.providers.InfuraProvider('mainnet', infuraKey);

		etherscanLink = `https://etherscan.io/address/${contractAddress}`;

		const abi: string = etherscanRes.data.result;
		if(!abi.includes(methodName)) {
			alert(`No method ${methodName} in the ABI!`);
			return;
		}
		try {

			const contract = new ethers.Contract(contractAddress, abi, provider);
			const data = contract.interface.encodeFunctionData(methodName, args);	
			result = data;
		} catch(e: any) {
			if(e.code === 'INVALID_ARGUMENT') {
				alert('Wrong/missing arguments!');
			}
		}
	};
</script>

<svelte:head>
	<title>Data encoder</title>
	<meta name="description" content="Ethereum data encoder" />
</svelte:head>

<section>
	<h1>
		Data encoder
	</h1>
	<input placeholder="Etherscan API key" bind:value={etherscanKey} />
	<input placeholder="Infura API key" bind:value={infuraKey} />

	<input placeholder="Contract address" bind:value={contractAddress} />
	<input placeholder="Method name" bind:value={methodName} />

	<input placeholder="Add argument" bind:value={newArg} on:change={onAddArgument} />
	<button on:click={onAddArgument}>Add argument!</button>
	Current args:
	<ol> 
		{#each args as a}
			<li>{a}</li>
		{/each}
	</ol>
	<button on:click={clearArgs}>Delete all arguments</button>

	<button on:click={onEncodeData}>Encode!</button>

	{#if etherscanLink}
		<h2>See contract on etherscan: {etherscanLink}</h2>
	{/if}
	<h2>{result}</h2>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	input {
		margin: 10px;
		width: 50%;
		height: 50px;
		border-radius: 5px;
	}

	button {
		width: 50%;
		height: 50px;
	}
</style>
