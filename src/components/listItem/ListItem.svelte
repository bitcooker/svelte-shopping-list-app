<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { clickEscape } from "../../helpers/escapeClick/EscapeClick";

  // Assets
  import DeleteIcon from "../../icons/deleteIcon/DeleteIcon.svelte";

  // Types
  import type ShoppingItem from "../../types/ShoppingItem";

  // Props
  export let checked: boolean;
  export let value: string;
  export let item: ShoppingItem;
  export let removeEmptyItem;

  // Helpers
  function focus(node) {
    if (!node.id) node.focus();
  }
</script>

<li class="item" in:fly={{ y: 10, duration: 1000 }} out:fade>
  <div>
    <input bind:checked type="checkbox" on:change />
    <input
      id={item.name}
      bind:value
      type="text"
      class:checked={item.bought}
      class:new-item={!item.name}
      use:focus
      use:clickEscape={() => {
        removeEmptyItem();
      }}
    />
  </div>
  <button type="button" on:click><DeleteIcon /></button>
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
    border: none;
  }

  .new-item {
    border: inset;
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
