<script lang="ts">
  // Assets
  import DeleteIcon from "../../icons/deleteIcon/DeleteIcon.svelte";

  // Types
  import type ShoppingItem from "../../types/ShoppingItem";

  // Props
  export let checked: boolean;
  export let item: ShoppingItem;
</script>

<li class="item">
  <div>
    <input bind:checked type="checkbox" on:change />
    <span class="text {item.bought && 'checked'}">{item.name}</span>
  </div>
  <button on:click><DeleteIcon /></button>
</li>

<style>
  .item {
    list-style: none;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  input {
    margin: 0;
    cursor: pointer;
  }

  .text {
    margin-left: 1.1rem;
  }

  .checked {
    text-decoration: line-through;
  }

  button {
    background-color: transparent;
    border: none;
    fill: grey;
    cursor: pointer;
  }

  button:hover,
  :focus {
    fill: black;
  }

  button:active {
    background-color: transparent;
    border: none;
    transform: scale(0.88);
  }
</style>
