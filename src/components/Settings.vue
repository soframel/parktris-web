<template>
  <div class="settings">
    <h1>Server Settings</h1>
   
   <p>Server URL: <input v-model="url" placeholder="http://localhost:8080"></p>
   <p>Username: <input v-model="username"  placeholder="login"></p>
    <p>Password: <input v-model="password" type="password" placeholder="password"></p>
  
      <div>
      <b-button v-on:click="checkConnection">Validate</b-button>
      </div>  
      <div class="message">{{message}}</div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Settings',
  data() {
    return {
       url:null,
      username:null,
      password:null,
      message:""
    }
  },
  //Save settings in Local Storage
  methods: {
    checkConnection: function(){
      axios.get(this.url + "/areas", {
         auth: {
          username: this.username,
          password: this.password
        }, 
        withCredentials: true
      }
      )
      .then(function(){
        var settings={
          url: this.url,
          username: this.username,
          password: this.password
        }
        this.$emit('settings', JSON.stringify(settings))
        this.message="Connection is working, settings now used on this site."
    }.bind(this))
      .catch(function (error) {
        this.message="Connection problem: "+error
      }.bind(this))
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

<style src="../style.css"/>