<script>
  // Components
  import Form from "./form/Form.svelte";
  import ListItem from "./listItem/ListItem.svelte";

  // Variables
  export let newItem = "";
  export let shoppingList = [
    { name: "Quinoa", bought: true },
    { name: "Watermelon", bought: false },
    { name: "Chocolate", bought: false },
  ];

  // Actions
  function addToList() {
    shoppingList = [...shoppingList, { name: newItem, bought: false }];
    newItem = "";
  }
</script>

<main>
  <div class="list-container">
    <h1>Shopping List</h1>
    <Form bind:value={newItem} {shoppingList} {addToList} {newItem} />
    <ul class="list">
      {#each shoppingList as item, index}
        <ListItem {item} {index} />
      {/each}
    </ul>
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
