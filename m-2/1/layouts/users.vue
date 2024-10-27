<template>
  <div>

    <Header></Header>
    <header>
      Users Section
    </header>
    <Nuxt />
  </div>

</template>

<script>
import Header from '~/components/Header.vue';

export default{
  components: {
    Header
  }
}

</script>
