import Vuex from 'vuex';
import Cookies from 'js-cookie';


const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null,
    },
    mutations: {
      setPosts(state, posts){
        state.loadedPosts = posts;
      },
      addPost(state, post){
        state.loadedPosts.push(post);
      },
      editPost(state, editedPost){
        const postindex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        );

        state.loadedPosts[postindex] = editedPost;
      },
      setToken(state, token)
      {
        state.token = token;
      },
      clearToken(state){
        state.token = null;
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context){
        //check if we are on the server
        // if(!process.client ){
        //   console.log(context.req.session);
        // }

        return context.app.$axios.$get('/posts.json')
          .then( data => {
            const postsArray = [];
            for(const key in data){
              postsArray.push({...data[key], id: key});
            }
            vuexContext.commit('setPosts', postsArray);
          })
          .catch(e => context.error(e));

        // return new Promise((resolve, reject) => {
        //   setTimeout(()=>{
        //     vuexContext.commit('setPosts',
        //       [
        //         {
        //           id: "1", title: "first Post", previewText: "this is our first post", thumbnail:  "https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg"
        //         },
        //         {
        //           id: "2", title: "first Post", previewText: "this is our second post", thumbnail: "https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg"
        //         }
        //       ]
        //     );
        //     resolve();
        //   }, 1500);
        // });

      },
      setPosts(vuexContext, posts){
        vuexContext.commit("setPosts", posts);
      },
      addPost(vuexContext, post){

        const createdPost = {...post, updatedDate: new Date()};
        return this.$axios.$post(
          'https://nuxt-tutorial-4f7da-default-rtdb.firebaseio.com/posts.json?auth=' + vuexContext.state.token,
          createdPost
        )
        .then(data =>{
          vuexContext.commit('addPost', {...createdPost, id: data.name});
        })
        .catch(e => console.log(e));
      },
      editPost(vuexContext, editedPost){
        return this.$axios.$put('https://nuxt-tutorial-4f7da-default-rtdb.firebaseio.com/posts/' + editedPost.id + ".json?auth=" + vuexContext.state.token, editedPost)
        .then(res => {
          vuexContext.commit('editPost', editedPost);
        })
        .catch(e => console.log(e));
      },
      authenticateUser(vuexContext, authData)
      {
        let authURl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + process.env.fbAPIKey;


        if(!authData.isLogin)
        {
          authURl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + process.env.fbAPIKey
        }

        return this.$axios.post(authURl, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        })
        .then(result => {
          vuexContext.commit('setToken', result.data.idToken);

          localStorage.setItem('token', result.data.idToken);
          localStorage.setItem('tokenExpiration', new Date().getTime() + Number.parseInt(result.data.expiresIn ) * 1000);

          Cookies.set('jwt', result.data.idToken);
          Cookies.set('expirationDate', new Date().getTime() + Number.parseInt(result.data.expiresIn ) * 1000);



          console.log(Cookies);

          return this.$axios.$post('http://localhost:3000/api/track-data', {
            data: 'Authenticated!'
          });

          
        })
        .catch(error => {
          console.error(error);
        })
      },
      // setLogoutTimer(vuexContext, duration){
      //   setTimeout(() => {
      //     vuexContext.commit('clearToken');
      //   }, duration);
      // },
      initAuth(vuexContext, req){
        let token;
        let expirationDate;

        //check the request for cookies
        if(req)
        {
          if(!req.headers.cookie)
          {
            return;
          }

          const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='));

          //if no jwt toke found , reutrn
          if(!jwtCookie){
            return;
          }

           token = jwtCookie.split('=')[1];

           expirationDate = req.headers.cookie.split(';').find(c => c.trim().startsWith('expirationDate=')).split('=')[1];

        }
        else if(process.client){
           token = localStorage.getItem("token");
           expirationDate = localStorage.getItem("tokenExpiration");
        }
        else{
          token = null;
          expirationDate = null;
        }

        if(new Date().getTime() > +expirationDate || !token)
        {
          console.log("no token or invalid token");
          vuexContext.dispatch('logout');
          return;
        }
        vuexContext.commit('setToken', token);
      },
      logout(vuexContext){
        vuexContext.commit('clearToken');

        Cookies.remove('jwt');
        Cookies.remove('expirationDate');

        //check if we are on client side
        if(process.client)
        {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
        }

      }
    },
    getters: {
      loadedPosts(state)
      {
        return state.loadedPosts;
      },
      isAuthenticated(state)
      {
        return state.token!== null;
      }
    }
  });
}

export default createStore;
