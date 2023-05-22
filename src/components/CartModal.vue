<template>
    <button class="cart-button" @click="openModal">Cart
      <p>{{ cartItemCount }}</p>
    </button>
    <div class="modal-overlay" v-if="showCartModal">
      <div class="modal-container">
        <h2 v-if="showLoginModal">Cart</h2>
        <form @submit.prevent="submitForm">
          <div class="modal-content">
            <ul>
              <div :key="item.key" v-for="item in items">
                <Item :item="item"></Item>
              </div>
            </ul>
          </div>
          <button type="submit" @click="buy">Buy</button>
          <button class="close-button" @click="closeModal">Close</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import Item from './Item.vue';
  import axios from 'axios';
    let url = "http://localhost:3000";
    const instance = axios.create();
  export default {
    name:'CartModal',
    components:{
      Item
    },
    props(){
    },
    methods:{
      openModal() {
        instance.get(url+"/users/"+user.id).then(response=>{
          this.items = response.data.cart.items
        })
        this.showCartModal= true;
      },
      buy(){

      }
    },
    setup() {
      const showCartModal = ref(false);
      const cartItemCount = ref(0);
      function closeModal() {
        showCartModal.value = false;
      }
      function openModal() {
        showCartModal.value= true;
      }
  
      function submitForm() {
        // Logic for form submission
      }
  
      // Computed property to calculate the number of items in the cart
      const computedCartItemCount = computed(() => {
        // Calculate the actual count based on your data
        return 5; // Replace with your actual logic
      });
  
      return {
        showCartModal,
        cartItemCount,
        closeModal,
        computedCartItemCount,
        submitForm
      };
    }
  };
  </script>
  
  <style>
  .cart-button {
    padding: 10px;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100px;
    float: right;
    height: 36px;
    margin-top: 5px;
    margin-right: 5px;
  }
  
  .modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }
  
  .modal-overlay {
    position: fixed;
    z-index: 2;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-container {
    background-color: #fefefe;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-height: 80%;
    overflow-y: auto;
  }
  
  .modal-container h2 {
    margin-top: 0;
  }
  
  .modal-content ul {
    list-style-type: none;
    padding: 0;
  }
  
  .modal-content ul li {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  
  .modal-content ul li:last-child {
    border-bottom: none;
  }
  
  .modal-container button {
    margin-top: 10px;
  }
  
  .close-button {
    background-color: #ccc;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
  }
  </style>
  