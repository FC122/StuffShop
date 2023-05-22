<template>
    <div class="item">
      <div class="item-image">
        <img :src="item.picture" alt="Item Picture" class="item-picture">
      </div>
      <div class="item-details">
        <h2 class="item-name">{{ item.name }}</h2>
        <p class="item-description">{{ item.description }}</p>
        <p class="item-price">$ {{ item.price }}</p>
        <p class="item-description">Supply: {{ item.supply }}</p>
        <button class="add-to-cart-button" @click="this.$emit('add-to-cart', item)">Add to Cart</button>
      </div>
    </div>
  </template>
  
  
  <script>
  export default {
    name:'Item',
    props: {
      item: Object
    },
    methods: {
    }
  };
  </script>
  
<style scoped>
.item {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  width: 300px;
  height: 200px;
}

.item-image {
  margin-right: 20px;
}

.item-picture {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.item-name {
  font-size: 18px;
  margin: 10px 0;
  color: #333;
}

.item-description {
  font-size: 14px;
  color: #777;
}

.item-price {
  font-size: 16px;
  font-weight: bold;
  color: #27ae60;
}

.add-to-cart-button {
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>

