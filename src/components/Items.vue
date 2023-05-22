<template>
    <div :key="item.key" v-for="item in items">
        <Item :item="item" @add-to-cart="addToCart"></Item>
    </div>
</template>

<script>
import Item from './Item.vue';
export default(await import('vue')).defineComponent({
    name: 'Items',
    props:{
        items: Array
    },
    components:{
        Item
    },
    methods:{
        addToCart(item){
            this.$emit('add-to-cart',item)
        }
    }
})
</script>

