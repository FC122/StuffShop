<template>
    <div :key="item.key" v-for="item in items">
        <CartItem :item="item" @remove="removeItem"></CartItem>
    </div>
</template>

<script>
import CartItem from './CartItem.vue';
export default(await import('vue')).defineComponent({
    name: 'CartItems',
    props:{
        items: Array
    },
    components:{
        CartItem,
    },
    methods:{
        removeItem(item){
            this.$emit('remove',item)
        }
    }
})
</script>

