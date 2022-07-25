<script lang="ts">
    export let etherscanLink: string;
    export let isLoading: boolean;
    export let result: string;
</script>

{#if etherscanLink}
		<h2>See contract on etherscan: {etherscanLink}</h2>
{/if}
	<h2>
{#if isLoading}
		Loading...
{:else}
		{result}
{/if}
    </h2>