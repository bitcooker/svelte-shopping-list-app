<script lang="ts">
  // Props
  export let value: string;
  export let addToList = () => {};
</script>

<div class="form">
  <input class="input" bind:value type="text" placeholder="ex. apples" />
  <button type="submit" on:click={addToList}>Add</button>
</div>

<style>
  .form {
    width: 100%;
    display: flex;
  }

  .input {
    width: 100%;
    margin-right: 0.5rem;
  }

  button {
    background: #0b700e;
    border: none;
    color: #ffffff;
  }
</style>
