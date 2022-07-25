<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { ethers } from 'ethers';
	import SearchResult from '$lib/SearchResult.svelte';
	import Input from '$lib/Input.svelte';
	import { onMount } from 'svelte';
	import { network, getEtherscanLink, Networks } from '$lib/networks';
	import AbiDownload from '$lib/AbiDownload.svelte';

	onMount(() => {
	 	etherscanKey = localStorage.getItem('etherscanKey') ?? '';
	 	infuraKey = localStorage.getItem('infuraKey') ?? '';
		contractAddress = localStorage.getItem('contractAddress') ?? '';
		methodName = localStorage.getItem('methodName') ?? '';
		network.set(localStorage.getItem('network') as Networks ?? Networks.Mainnet);
		abi = localStorage.getItem('abi') ?? '';
	});

	let contractAddress = '';
	let methodName = '';
	let newArg = '';
	let args: string[] = [];
	let etherscanKey = '';
	let infuraKey = '';
	let etherscanLink = '';
	let abi = '';

	let result = '';
	let isLoading = false;

	const onAddArgument = () => {
		args = [...args, newArg];
		newArg = '';
	}

	const clearArgs = () => {
		args = [];
	}

	const getProvider = () => {
		return new ethers.providers.InfuraProvider($network, infuraKey);
	}

	const handleError = (e: any) => {
		if(e.code === 'INVALID_ARGUMENT') {
				alert('Wrong/missing arguments!');
		} else {
			alert(e.code);
		}
	}

	const checkAbi = () => {
		if(!abi.includes(methodName)){
			const e: any = new Error(`No method ${methodName} in the ABI!`); 
			e.code = `No method ${methodName} in the ABI!`;
			throw e;
		}
	}

	const onEtherscanAbiReceived = (newAbi: string) => {
		abi = newAbi;
	}

	const onEncodeData = async () => {
		isLoading = true;
		localStorage.setItem('etherscanKey', etherscanKey);
		localStorage.setItem('infuraKey', infuraKey);
		localStorage.setItem('contractAddress', contractAddress);
		localStorage.setItem('methodName', methodName);
		localStorage.setItem('network', $network);
		localStorage.setItem('abi', abi);

		const provider = getProvider();

		etherscanLink = getEtherscanLink(contractAddress);

		try {
			checkAbi();
			const contract = new ethers.Contract(contractAddress, abi, provider);
			const data = contract.interface.encodeFunctionData(methodName, args);	
			result = data;
			clearArgs();
		} catch(e: any) {
			handleError(e);
		} finally {
			isLoading = false;
		}
	};
	const networkVals = Object.entries(Networks);
</script>

<svelte:head>
	<title>Data encoder</title>
	<meta name="description" content="Ethereum data encoder" />
</svelte:head>

<section>
	<h1>
		Data encoder
	</h1>
	<div class="base-select">		
		<label for="network-select">Network</label>
		<select id="network-select" bind:value={$network}>
			{#each networkVals as net}
				<option value={net[1]}>{net[1]}</option>
			{/each}
		</select>
		</div>
		<div class="main-container">
		<div class="base-container">
			<h2 class="section-header">Method data</h2>
			<Input placeholder="Contract address" bind:value={contractAddress} label="Contract Address" />
			<Input placeholder="Method name" bind:value={methodName} label="Method Name" />
			<Input placeholder="Add argument" bind:value={newArg} label="Argument" />
			<div class="args-button-container">
				<button on:click={onAddArgument}>Add argument!</button>
				<button on:click={clearArgs}>Delete all arguments</button>
			</div>
				Current args:
			<ol> 
				{#each args as a}
				<li>{a}</li>
				{/each}
			</ol>
			<Input placeholder="Infura API key" bind:value={infuraKey} label="Infura Key" />
		</div>
		<div class="abi-container">
			<h2 class="section-header">ABI</h2>
			<textarea rows={10} placeholder="ABI" bind:value={abi} />
		</div>
	</div>
	<AbiDownload {contractAddress} {onEtherscanAbiReceived} />

	<button class="encode-button" on:click={onEncodeData}>Encode!</button>

	<SearchResult {result} {isLoading} {etherscanLink} />
</section>

<style>
	
	.main-container {
		display: flex;
		width: 80%;
	}

	.args-button-container {
		display: flex;
		margin-bottom: 5px;
	}

	.abi-container {
		min-height: 100%;
		width: 60%;
	}

	.abi-container textarea {
		width: 100%;
		height: 86%;
	}
	.section-header {
		font-size: larger;
    	font-weight: 800;
    	color: black;
	}

	.encode-button {
		margin: 10px;
	}

	.base-container {
		width: 40%;
	}

	.base-select {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;
		padding: 10px;
    }

	select {
		width: 100%;
	}

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

	textarea {
		width: 50%;
	}

	button {
		width: 50%;
		height: 50px;
	}

	@media(max-width: 850px) {
		.main-container {
			width: 100vw;
		}
	}

	@media(max-width: 750px) {
		.main-container {
			flex-direction: column;
		}
		.abi-container {
			width: 100%;
		}

		.base-container {
			width: 100%;

		}
	}
</style>
