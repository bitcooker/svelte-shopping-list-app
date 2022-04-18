<script lang="ts">
  import { fly, slide } from "svelte/transition";
  import { clickEscape } from "../../helpers/escapeClick/EscapeClick";

  // Assets
  import DeleteIcon from "../../icons/deleteIcon/DeleteIcon.svelte";

  // Types
  import type ShoppingItem from "../../types/ShoppingItem";

  // Props
  export let checked: boolean;
  export let value: string;
  export let item: ShoppingItem;
  export let removeEmptyItem: () => void;

  // Helpers
  function focus(node: HTMLInputElement) {
    if (!node.id) node.focus();
  }
</script>

<li
  class="list-none flex justify-between items-center pb-4"
  in:fly={{ y: 10, duration: 1000 }}
  out:slide={{ duration: 300 }}
>
  <div class="flex items-center">
    <input bind:checked type="checkbox" on:change class="cursor-pointer" />
    <input
      class="p-1.5 cursor-pointer border-none"
      id={item.name}
      bind:value
      type="text"
      class:line-through={item.bought}
      class:new-item={!item.name}
      use:focus
      use:clickEscape={() => {
        removeEmptyItem();
      }}
    />
  </div>
  <button
    class="border-none cursor:pointer bg-transparent fill-grey hover:fill-black"
    type="button"
    on:click><DeleteIcon /></button
  >
</li>

<style>
  .new-item {
    border: inset;
  }

  button:active {
    background-color: transparent;
    border: none;
    transform: scale(0.88);
  }
</style>
