<template>
    <h1>{{ title }}</h1>
    <div class="container">
        <Button id="cart" class="cart" @btn-click="$emit('cart')" :text="'Cart'"></Button>
        <Button id="login" class="login" @btn-click="$emit('log-in')" :text="'Log In'"></Button>
        <Button id="signup" class="signup" @btn-click="$emit('sign-up')" :text="'Sign Up'"></Button>
    </div>
    <h3>{{ itemsInCart }}</h3>
</template>

<script>
import Button from './Button.vue'
import Items from './Items.vue';
export default{
    name:'Header',
    props:{
        title:{
            type: String,
            default: 'Stuff Shop',
        },
        itemsInCart: {
            type: Number,
            default: 0,
        },
    },
    data(){
      
    },
    components:{
        Button
    }
}
</script>

<style>
.container{
    display: grid;
    grid-template-columns: auto auto auto;;
}
</style>