<template>
  <div class="posts-page">
    <PostList :posts="loadedPosts"/>
  </div>
</template>

<script>
  export default{
    // fetch(context){

    //   return new Promise((resolve, reject) => {
    //     setTimeout(()=>{
    //       resolve({
    //         loadedPosts:
    //         [
    //           {
    //             id: "1", title: "first Post", previewText: "this is our first post", thumbnail: "vchchchhchchch"
    //           },
    //           {
    //             id: "2", title: "first Post", previewText: "this is our second post", thumbnail: "vchchchhchchch"
    //           }
    //         ]
    //       });
    //     }, 1500);
    //   })
    //   .then(data => {
    //     context.store.commit('setPosts', data.loadedPosts);
    //   })
    //   .catch((e)=>{
    //     context.error(e);
    //   });

    // },
    middleware: 'log',
    computed: {
      loadedPosts(){
        return this.$store.getters.loadedPosts;
      }
    }
    // created(){
    //   this.$store.dispatch('setPosts', this.loadedPosts);
    // }
  }
</script>

<style scoped>
  .posts-page {
    display: flex;
    justify-content: center;
    align-items: center;
  }


</style>
