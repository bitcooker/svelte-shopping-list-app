<script lang="ts">
  // Components
  import ListItem from "./components/listItem/ListItem.svelte";

  // Helpers
  import { clickOutside } from "./helpers/outsideClick/OutsideClick.js";

  // Assets
  import PlusIcon from "./icons/plusIcon/PlusIcon.svelte";

  // Types
  import type ShoppingItem from "./types/ShoppingItem";

  // Variables
  export let newItem: string = "";
  export let shoppingList: ShoppingItem[] = [
    { name: "Watermelon", bought: false },
    { name: "Chocolate", bought: false },
    { name: "Quinoa", bought: false },
  ];
  // Actions
  function addToList() {
    shoppingList = shoppingList.concat({ name: newItem, bought: false });
  }

  function handleSubmit(event) {
    const emptyItem = !!shoppingList.findIndex((item) => !item.name);
    if (emptyItem) {
      event.preventDefault();
    } else {
      const toBuyItems = shoppingList
        .filter((item) => !item.bought)
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
      const boughtItems = shoppingList.filter((item) => item.bought);
      shoppingList = [...toBuyItems, ...boughtItems];
      addToList();
    }
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

  function removeEmptyItem() {
    const emptyItem = shoppingList.findIndex((item) => !item.name);
    if (emptyItem !== -1) {
      removeItem(emptyItem);
    }
  }
</script>

<main>
  <div class="list-container">
    <h1>Shopping List</h1>
    {#if shoppingList.length === 0}
      <p>Your shopping list is empty!</p>
    {:else}
      <ul class="list">
        {#each shoppingList as item, index}
          <form on:submit|preventDefault={handleSubmit}>
            <ListItem
              {removeEmptyItem}
              bind:value={item.name}
              on:change={() => updateList(index)}
              bind:checked={item.bought}
              on:click={() => removeItem(index)}
              {item}
            />
          </form>
        {/each}
      </ul>
    {/if}
    <button
      use:clickOutside={() => {
        removeEmptyItem();
      }}
      type="button"
      on:click={addToList}
      class="add-button"
      disabled={!!shoppingList.find((item) => !item.name)}
      ><span class="text-button">Add new item</span> <PlusIcon /></button
    >
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
    display: flex;
    flex-direction: column;
  }

  .list {
    display: flex;
    flex-direction: column;
    padding-left: 1rem;
  }

  .add-button {
    border-radius: 20px;
    display: flex;
    align-items: center;
    margin: 0;
    background: transparent;
    fill: #0b700e;
    border: none;
    padding: 5px 10px;
    width: fit-content;
    align-self: center;
    cursor: pointer;
  }

  .add-button:hover {
    fill: #9fde42;
    color: #9fde42;
  }

  .add-button:active {
    background-color: transparent;
    border: none;
    transform: scale(0.88);
  }

  .add-button:disabled,
  .add-button:disabled:hover {
    color: rgb(181, 169, 169);
    cursor: default;
    fill: rgb(181, 169, 169);
  }

  .text-button {
    margin-right: 10px;
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
