<script lang="ts">
  // Components
  import ListItem from "./components/listItem/ListItem.svelte";
  import Form from "./components/form/Form.svelte";

  // Types
  import type ShoppingItem from "./types/ShoppingItem";

  // Variables
  export let newItem: string;
  export let shoppingList: ShoppingItem[] = [
    { name: "Watermelon", bought: false },
    { name: "Chocolate", bought: false },
    { name: "Quinoa", bought: true },
  ];

  // Actions
  function addToList() {
    const newList = [{ name: newItem, bought: false }, ...shoppingList];
    shoppingList = newList;
    newItem = "";
  }

  function updateList(index: number) {
    const newList = [...shoppingList];
    const changedElement = newList.splice(index, 1)[0];
    changedElement.bought
      ? newList.splice(newList.length, 0, changedElement)
      : newList.splice(0, 0, changedElement);
    shoppingList = newList;
  }

  function removeItem(index: number) {
    const newList = [...shoppingList];
    newList.splice(index, 1);
    shoppingList = newList;
  }
</script>

<main>
  <div class="list-container">
    <h1>Shopping List</h1>
    <Form bind:value={newItem} on:click={addToList} />
    {#if shoppingList.length === 0}
      <p>Your shopping list is empty!</p>
    {:else}
      <ul class="list">
        {#each shoppingList as item, index}
          <ListItem
            on:click={() => removeItem(index)}
            on:change={() => updateList(index)}
            bind:checked={item.bought}
            {item}
          />
        {/each}
      </ul>
    {/if}
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1rem;
  }

  h1 {
    color: #0b700e;
    text-transform: uppercase;
    font-size: 2rem;
    font-weight: 400;
    margin-top: 0;
  }

  .list-container {
    padding: 1rem;
    margin: 0 auto;
    border: #9fde42 solid 5px;
    border-radius: 1rem;
  }

  .list {
    display: flex;
    flex-direction: column;
    padding-left: 1rem;
  }
  @media (min-width: 640px) {
    h1 {
      font-size: 4rem;
    }
    .list-container {
      padding: 2rem;
      max-width: max-content;
    }
  }
</style>
