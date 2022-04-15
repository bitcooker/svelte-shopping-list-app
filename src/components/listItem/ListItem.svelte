<script lang="ts">
  // Types
  import type ShoppingItem from "../../types/ShoppingItem";

  // Props
  export let item: ShoppingItem;
</script>

<li class="item">
  <input bind:checked={item.bought} type="checkbox" />
  <span class="text {item.bought && 'checked'}">{item.name}</span>
</li>

<style>
  .item {
    list-style: none;
    text-align: left;
  }

  .text {
    margin-left: 1.1rem;
  }

  .checked {
    text-decoration: line-through;
  }
</style>
