<template>
  <div>
    <h1>the users view</h1>
      <input type="text" v-model="userId">
      <button @click="onLoadUser">Load User</button>
      <nuxt-child></nuxt-child>
  </div>
</template>

<script>
export default{
  data()
  {
    return {
      userId: "",
    }
  },
  methods: {
    onLoadUser(){
        this.$router.push('/users/' + this.userId);
    }
  },
  layout: 'users'
}
</script>
