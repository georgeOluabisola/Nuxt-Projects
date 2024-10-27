export default function (context) {
  console.log('middleware check auth');
  //server side(attach request, to let it use cookies)
  if(!process.client)
  {
    context.store.dispatch('initAuth', context.req);
  }
  //client side(null, to let it use localstorage)
  else{
    context.store.dispatch('initAuth',null);

  }

  
}
