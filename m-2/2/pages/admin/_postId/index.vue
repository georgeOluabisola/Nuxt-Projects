<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
  import AdminPostForm from '@/components/Admin/AdminPostForm';


  export default {
    layout: 'admin',
  middleware: ['check-auth', 'auth'],
    components: {
      AdminPostForm
    },
    asyncData(context){
      return context.app.$axios.$get('/posts/' + context.params.postId + ".json"
      )
      .then(data => {
        return {
          loadedPost: {...data, id: context.params.postId}
        }
      })
      .catch(e => context.error());
    },
    methods: {
      onSubmitted(editedPost){
        this.$store.dispatch("editPost", editedPost).then(() => {
          this.$router.push('/admin');
        });
      }
    }
    // data(){
    //   return {
    //     loadedPost: {
    //       author: 'Maximillian',
    //       title: 'My awesome Post',
    //       content: 'Super Amazing, thanks for that',
    //       thumbnailLink: "https://dfdkbfkdbgkg.jpg",
    //     }
    //   }
    // }
  }
</script>

<style scoped>
  .update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
