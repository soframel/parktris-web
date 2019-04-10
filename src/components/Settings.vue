<template>
  <div class="settings">
    <h1>Server Settings</h1>
   
   <p>Server URL: <input v-model="url" placeholder="http://localhost:8080"></p>
   <p>Username: <input v-model="username"  placeholder="login"></p>
    <p>Password: <input v-model="password" type="password" placeholder="password"></p>
  
      <div>
      <b-button v-on:click="checkConnection">Check Connection</b-button>
      </div>  
  </div>
</template>

<script>
export default {
  name: 'Settings',
  /*props: {
    url: {type: String, default:"http://localhost:8080" },
    username: {type: String, default:"login" },
    password:{type: String, default:"password" },
  },*/
  data() {
    return {
       url:null,
      username:null,
      password:null
    }
  },
  //Save settings in Local Storage
  methods: {
    checkConnection: function(){
      alert("checkConnection with url={{url}}");
    },
    save: function(){
      alert("save");
    },
    cancel: function(){
      alert("ccancelcanheckConnection");
    }
  },
  mounted() {
    if (localStorage.url) {
      this.url = localStorage.url;
    }
     if (localStorage.username) {
      this.username = localStorage.username;
    }
     if (localStorage.password) {
      this.password = localStorage.password;
    }
  },
  watch: {
    url(s) {
      localStorage.url = s;
    },
     username(s) {
      localStorage.username = s;
    },
     password(s) {
      localStorage.password = s;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
