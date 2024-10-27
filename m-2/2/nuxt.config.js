const pkg = require('./package');
const bodyParser = require('body-parser');
const axios = require('axios');

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fa923f' , failedColor: '#fa923f', height: '4px', duration: 5000},
  loadingIndicator: {
    name: 'circle',
    color: '#fa923f'
  },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/styles/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/core-components.js',
    '~/plugins/date-filter.js',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    // proxy: true,
    baseURL: process.env.BASE_URL || 'https://nuxt-tutorial-4f7da-default-rtdb.firebaseio.com',
    credentials: false,
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  },
  env:  {
    baseUrl: process.env.BASE_URL || 'https://nuxt-tutorial-4f7da-default-rtdb.firebaseio.com',
    fbAPIKey: 'AIzaSyDu3FHg-oyedXlfCwR1fsXwO_0zZ8M9IBE'
  },
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  router: {
    middleware: 'log',
  },
  // router: {
  //   extendsRoutes(routes, resolve){
  //     linkActiveClass: 'active',
  //     // routes.push({
  //     //   path: '/blog/:slug',
  //     //   component: resolve(__dirname, 'pages/blog/_slug.vue'),
  //     //   name: 'blog-post'
  //     // })
  //   }
  // },

  serverMiddleware: [
    bodyParser.json(),
    '~/api'
  ],
  generate: {
    routes: function(){
      return axios.get('https://nuxt-tutorial-4f7da-default-rtdb.firebaseio.com/posts.json')
      .then(res => {
        const routes =[];

        for(const key in res.data)
        {
          routes.push({
            route: '/posts/' + key,
            payload: {postData: res.data[key]}
          });
        }

        return routes;
      });
    }
  }
}
