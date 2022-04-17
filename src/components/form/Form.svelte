<script lang="ts">
  // Props
  export let value: string;
</script>

<div class="form">
  <input
    on:submit
    class="input"
    bind:value
    type="text"
    placeholder="eg. apples"
  />
  <button disabled={!value} on:click>Add</button>
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
    cursor: pointer;
  }
  button:active {
    transform: scale(0.88);
  }

  button:hover,
  :focus {
    background: none;
    border: #0b700e 1px solid;
    color: #0b700e;
  }

  button:disabled,
  button:disabled:hover {
    background-color: rgb(160, 156, 156);
    color: white;
    cursor: default;
    border: none;
  }
</style>
