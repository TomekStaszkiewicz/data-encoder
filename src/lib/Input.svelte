<script lang="ts">
    export let label = '';
    export let value = '';

</script>
<div class="base-input">
    <label class="base-input__label" for={`input-${label}`}>
        {label}
    </label>
    <input class="base-input__input" bind:value={value} id={`input-${label}`} {...$$restProps}/>
</div>

<style>

    .base-input__input {
        width: 90%;
        height: 30px;
        border-radius: 5px;
        border: 1px solid black;
        padding: 5px 10px;
    }

    .base-input {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 5px;
    }

    .base-input__label {
        font-weight: 800;
    }
</style>