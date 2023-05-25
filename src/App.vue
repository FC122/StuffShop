<template>
  <div class="app">
    <Header @log-in="openLoginModal" @sign-up="openSignUpModal" @cart="openCart" :items-in-cart="cartItems.length"></Header>
    <div class="search-bar">
  <input type="text" v-model="searchQuery" placeholder="Search items" @input="searchItems" />
</div>
    <div class="container">
      <Items :items="filteredItems" @add-to-cart="addToCart"></Items>
    </div>
  </div>

    <div class="modal-overlay" v-if="showCart">
      <div class="modal-container">
        <h2 v-if="showLoginModal">Cart</h2>
        <form @submit.prevent="submitForm">
          <div class="modal-content">
            <ul>
              <CartItems :items="cartItems" @remove="removeItem"></CartItems>
            </ul>
          </div>
          <p>{{ this.cartSum }}$</p>
          <button type="submit" @click="buy">Buy</button>
          <button class="close-button" @click="closeCart">Close</button>
        </form>
      </div>
    </div>

    <div id="loginModal" class="login-modal" v-if="showLoginModal">
      <div class="modal-content">
        <h2>Login</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username">
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password">
          </div>
          <button type="submit" @click="logIn">Login</button>
          <button class="close-button" @click="closeLogIn">Close</button>
        </form>
      </div>
    </div>

    <div id="signUpModal" class="login-modal" v-if="showSignUpModal">
      <div class="modal-content">
        <h2>SignUp</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="usernameSU" v-model="username">
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="passwordSU" v-model="password">
          </div>
          <div class="form-group">
            <label for="username">Ballance:</label>
            <input type="username" id="ballance" v-model="ballance">
          </div>
          <button type="submit" @click="signUp">SignUp</button>
          <button class="close-button" @click="closeSignUp">Close</button>
        </form>
      </div>
    </div>
</template>


<script>
import Items from './components/Items.vue';
import Header from './components/Header.vue';
import CartItems from './components/CartItems.vue';
import axios from 'axios';
let url = "https://stuffshopserver.onrender.com";
const instance = axios.create();
export default {
  name: 'App',
  components: {
    Items,
    Header,
    CartItems
  },
  computed: {
  filteredItems() {
    if (!this.searchQuery) {
      return this.items; // If no search query, return all items
    }

    const query = this.searchQuery.toLowerCase();
    return this.items.filter((item) => {
      return item.name.toLowerCase().includes(query);
    });
  },
},

  data() {
    return {
      items: [],
      cartItems:[],
      showLoginModal:false,
      showSignUpModal:false,
      showCart:false,
      user:null,
      searchQuery:'',
      cartSum:0
    };
  },
  methods: {
    async fetchTasks() {
      const response = await instance.get(url + '/items');
      this.items = response.data;
    },
    openLoginModal(){
      this.showLoginModal = true;
    },
    openSignUpModal(){
      this.showSignUpModal = true;
    },
    openCart(){
      this.showCart = true;
    },
    closeLogIn(){
      this.showLoginModal=false;
    },
    closeSignUp(){
      this.showSignUpModal=false;
    },
    closeCart(){
      this.showCart=false;
    },
    async logIn(){
      let logInUsername = document.getElementById('username');
      let logInPassword = document.getElementById('password');
      const response = await instance.get(url+"/users?username="+logInUsername.value+"&password="+logInPassword.value)
      this.user=response.data[0]
      console.log(this.user)
      this.showLoginModal=false
      this.cartItems=this.user.cart.items
      document.getElementById('login').style.display='none';
      document.getElementById('signup').style.display='none'

    },
    async signUp(){
      let newUser={
        "username": document.getElementById('usernameSU').value,
        "password": document.getElementById('passwordSU').value,
        "id": Math.floor(Math.random() * Math.pow(2,32)) + 1,
        "ballance": document.getElementById('ballance').value,
        "cart": {
          "items": [
          ]
        }
    }
    this.showSignUpModal=false;
    await instance.post(url+"/users",newUser)
    },
    async buy(){
      if(this.user===undefined){
        console.log("Please Log In")
    }else{
        instance.get(url+"/users/"+this.user.id).then(response=>{
            let user = response.data;
            let items = user.cart.items;
            let total=0;
            for(let i=0; i<items.length;i++){
                total +=items[i].price
            }
            let invoice={
                "user":user,
                "total":total,
                "id":Math.floor(Math.random() * Math.pow(2,32)) + 1
            };
            instance.post(url+"/invoices",{
                invoice
            })
            console.log(invoice)
            instance.patch(url+"/users/"+this.user.id,{
                cart:{items:[]}
            })
            instance.patch(url+"/users/"+this.user.id,{
                ballance:this.user.ballance-=total
            })
            instance.get(url+"/users/"+this.user.id).then(response=>{
                this.user=response.data
            })
        })
        this.cartItems=[]
    }
    },
    async addToCart(item){
      if(this.user!=null){
        this.cartItems.push(item);
      }
      let endpoint = "http://localhost:3000/items/" + item.id
        instance.get(endpoint).then(response=>{
            let item = response.data
            instance.get("http://localhost:3000/users/"+this.user.id).then(response=>{
                response.data.cart.items.push(item)
                //console.log(response.data.cart.items.push(item))
                instance.patch("http://localhost:3000/users/"+this.user.id,{
                    cart:response.data.cart
                }).then(response=>{
                    console.log("Cart: "+JSON.stringify(response.data.cart.items))
                    instance.patch("http://localhost:3000/items/"+item.id,{
                        supply:item.supply-1
                    })
                })
            })
        })
        instance.get(url+"/users/"+this.user.id).then(response=>{
            this.user=response.data
        })
        await this.fetchTasks()
        this.$forceUpdate()
        
    },
    async removeItem(item){
      if(this.user!=null){
        const indexToRemove = this.cartItems.findIndex((cartItem) => cartItem.id === item.id);
        if (indexToRemove !== -1) {
          this.cartItems.splice(indexToRemove, 1);
        }
      
      let endpoint = "http://localhost:3000/items/" + item.id
        instance.get(endpoint).then(response=>{
            let item = response.data
            instance.get("http://localhost:3000/users/"+this.user.id).then(response=>{
                response.data.cart.items.splice(indexToRemove,1)
                //console.log(response.data.cart.items.push(item))
                instance.patch("http://localhost:3000/users/"+this.user.id,{
                    cart:response.data.cart
                }).then(response=>{
                    console.log("Cart: "+JSON.stringify(response.data.cart.items))
                    instance.patch("http://localhost:3000/items/"+item.id,{
                        supply:item.supply+1
                    })
                })
            })
        })
        instance.get(url+"/users/"+this.user.id).then(response=>{
            this.user=response.data
        })
        await this.fetchTasks()
        this.$forceUpdate()
      }
    },
    calculateCartSum() {
      this.cartSum = this.cartItems.reduce((total, item) => total + item.price, 0);
    },
  },
  async created(){
    await this.fetchTasks();
  },
  watch: {
    cartItems: {
      handler() {
        this.calculateCartSum();
      },
      deep: true
    }
  }
}; 
</script>


<style scoped>
.app{
  display: grid;
  place-items: center;
  font-family: Arial, sans-serif;
}
.container{
  display: grid;
  grid-template-columns: auto auto auto;
}
@media screen and (max-width: 700px){
  .container{
  grid-template-columns: auto;
}
}
.login-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  button[type="submit"] {
    background-color: #27ae60;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 10px;
  }
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
    width: 25%;
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
    background-color:crimson;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 10px;
  }
</style>

