<template>
    <button @click="onClick()" :style="{ background: color }" class="btn">{{ text }}</button>
  </template>
  
  <script>
  export default {
    name: 'Button',
    props: {
      text: String,
      color: String,
    },
    methods: {
      onClick() {
        this.$emit('btn-click');
      },
    },
  };
  </script>
  
<style>
.btn{
display: inline-block;
  background:cornflowerblue;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}
</style>