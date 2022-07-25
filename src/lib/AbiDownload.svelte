
<script lang="ts">
    import axios from "axios";
    import { getEtherscanAbiEndpoint } from "./networks";

    export let contractAddress: string;
    export let onEtherscanAbiReceived: (abi: string) => void;

    const getAbi = async () => {
        const etherscanKey = prompt("Your etherscan key");
        console.log(contractAddress, etherscanKey);
        if(!etherscanKey) {
            return;
        }
		const abiLink = getEtherscanAbiEndpoint(contractAddress, etherscanKey);

		const etherscanRes = await axios.get(abiLink);
		onEtherscanAbiReceived(etherscanRes.data.result as string);
	}


</script>
	<div class="etherscan-download-container">
        <span>Don't have the ABI?</span>
        <button on:click={getAbi}>Try to download it</button>
    </div>
<style>
    .etherscan-download-container {
        display: flex;
        margin: 10px;
    }
</style>