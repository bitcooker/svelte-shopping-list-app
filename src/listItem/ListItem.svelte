<script>
  // Props
  export let item;
</script>

<li class="item">
  <input bind:checked={item.bought} type="checkbox" />
  <span class="text {item.bought && 'checked'}" class:checked={item.bought} text
    >{item.name}</span
  >
</li>

<style>
  .item {
    list-style: none;
    text-align: left;
  }

  .text {
    margin-left: 1rem;
  }

  .checked {
    text-decoration: line-through;
  }
</style>
