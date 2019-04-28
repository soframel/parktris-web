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

  <br/>
   <p><toggle-button v-model="wantSlot" @change="changedWantSlot"
      :labels="{checked: 'I need to borrow a slot', unchecked: 'I can lend a slot'}"
      :width="200" :height="30" :font-size="14"
      /></p>

  </div>
</template>

<script>

import axios from 'axios';
import {doesUserWantASlot, saveUserWantASlot} from '../server'

/**
 * Settings change page. 
 * Settings contain 2 parts: 
 * - server configuration settings (url, username, password), that are saved in local storage
 * - other settings, that are saved on server ("wantSlot" option for now). This one is loaded from server, and not saved in local storage. 
 * 
 * When settings change (server config or other settings), and event is sent to App with the settings content. 
 */

export default {
  name: 'Settings',
  data() {
    return {
       url:null,
      username:null,
      password:null,
      wantSlot:false,
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
        this.loadUserWantsSlot();
        this.sendSettingsEvent()
        this.message="Connection is working, settings now used on this site."
    }.bind(this))
      .catch(function (error) {
        this.message="Connection problem: "+error
      }.bind(this))
    }, 
    sendSettingsEvent(){      
        var settings={
          url: this.url,
          username: this.username,
          password: this.password, 
          wantSlot: this.wantSlot
        }        
        this.$emit('settings', JSON.stringify(settings))
    }
    ,
    loadUserWantsSlot: function(){
      doesUserWantASlot({url: this.url,username: this.username,password: this.password})
      .then(response => {      
          this.wantSlot=response.data;
      })
        .catch(function (error) {
          console.log("error in getting user wants a slot: "+error)
        }.bind(this))
    },    
    changedWantSlot: function(e){
      console.log("changing wantSlot to "+e.value)
      saveUserWantASlot({url: this.url,username: this.username,password: this.password}, e.value)
      .then(() => {      
          console.log("saved wantSlot - updating settings")
          this.sendSettingsEvent();
      })
        .catch(function (error) {
          console.log("error in saving user wants a slot: "+error)
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

    if(this.url){
      this.loadUserWantsSlot();
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