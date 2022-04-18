<script lang="ts">
  import { fade } from "svelte/transition";
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
    { name: "Chocolate", bought: false },
    { name: "Quinoa", bought: false },
    { name: "Watermelon", bought: false },
  ];
  // Actions
  function addToList() {
    shoppingList = shoppingList.concat({ name: newItem, bought: false });
  }

  function sortItems() {
    const toBuyItems = shoppingList
      .filter((item) => !item.bought)
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    const boughtItems = shoppingList.filter((item) => item.bought);
    shoppingList = [...toBuyItems, ...boughtItems];
  }

  function handleSubmit(event) {
    const emptyItem = shoppingList.findIndex((item) => !item.name);
    if (emptyItem !== -1) {
      event.preventDefault();
    } else {
      sortItems();
      addToList();
    }
  }

  function updateList(index: number) {
    const newList = [...shoppingList];
    const changedElement = newList.splice(index, 1)[0];
    newList.splice(0, 0, changedElement);
    shoppingList = newList;
    sortItems();
  }

  function removeItem(index: number) {
    const newList = [...shoppingList];
    newList.splice(index, 1);
    shoppingList = newList;
  }

  function removeEmptyItem() {
    const element = document.activeElement.tagName.toLowerCase();
    const emptyItem = shoppingList.findIndex((item) => !item.name);
    if (emptyItem !== -1 && element !== "input") {
      removeItem(emptyItem);
    }
  }
</script>

<main class="h-screen relative">
  <svg class="blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#FF0066"
      d="M43.8,-53.7C56.1,-41.8,65,-27.4,69.7,-10.8C74.3,5.7,74.7,24.5,66.2,37.2C57.7,49.9,40.3,56.4,25.6,55.1C10.9,53.8,-1,44.8,-15.2,40.3C-29.5,35.8,-46,35.9,-52,28.5C-58,21.2,-53.5,6.3,-47.9,-5.4C-42.2,-17.1,-35.4,-25.6,-27.3,-38.2C-19.1,-50.8,-9.5,-67.4,3.1,-71.1C15.7,-74.8,31.4,-65.5,43.8,-53.7Z"
      transform="translate(100 100)"
    />
  </svg>
  <div
    class="list bg-white md:max-w-fit border-none rounded-xl shadow-lg shadow-berry px-14 pt-14 pb-10 flex flex-col my-0 mx-auto"
  >
    <h1
      class="antialiased mt-0 mb-4 text-berry text-center uppercase text-3xl md:text-6xl"
    >
      Shopping List
    </h1>
    {#if shoppingList.length === 0}
      <p
        class="text-center p-4"
        in:fade={{ delay: 300 }}
        out:fade={{ duration: 50 }}
      >
        Your shopping list is empty!
      </p>
    {:else}
      <ul class="pl-2 flex flex-col mt-5">
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
      class="add-button p-2.5 flex items-center self-center space-x-2 cursor-pointer text-berry fill-berry m-0 border-none bg-transparent hover:fill-berry-dark hover:text-berry-dark hover:bg-transparent"
      use:clickOutside={() => {
        removeEmptyItem();
      }}
      type="button"
      on:click={addToList}
      disabled={!!shoppingList.find((item) => !item.name)}
      ><span>Add new item</span> <PlusIcon /></button
    >
  </div>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .blob {
    position: relative;
    top: 29%;
    left: 22%;
    transform: translate(-50%, -50%);
  }
  .list {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media (min-width: 640px) {
    .blob {
      top: 50%;
      left: 50%;
    }
    .list {
      transform: translate(-50%, -50%);
    }
  }

  .add-button:active {
    background-color: transparent;
    border: none;
    transform: scale(0.88);
  }

  .add-button:disabled,
  .add-button:disabled:hover {
    color: rgb(181, 169, 169);
    fill: rgb(181, 169, 169);
    transform: none;
  }
</style>
