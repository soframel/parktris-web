<template>
  <div class="settings">
    <h1>Server Settings</h1>
   
   <p>Server URL: <input v-model="settings.url" v-on:="" placeholder="http://localhost:8080"></p>
   <p>Username: <input v-model="settings.username"  placeholder="login"></p>
    <p>Password: <input v-model="settings.password" type="password" placeholder="password"></p>
  
      <div>
      <b-button v-on:click="checkConnection">Validate</b-button>
      </div>  
      <div class="message">{{message}}</div>

  <br/>
   <p><toggle-button v-model="settings.wantSlot" @change="changedWantSlot" 
      :sync="true"
      :labels="{checked: 'I need to borrow a slot', unchecked: 'I can lend a slot'}"
      :width="200" :height="30" :font-size="14"
      /></p>

  </div>
</template>

<script>

import {loadSettingsFromStorage} from '../common'
import {doesUserWantASlot, saveUserWantASlot} from '../server'

/**
 * Settings change page. 
 * Settings contain 2 parts: 
 * - server configuration settings (url, username, password), that are saved in local storage
 * - other settings, that are saved on server ("wantSlot" option for now). This one is loaded from server + saved in local storage for performance reasons for other pages. 
 * 
 * When settings change (server config or other settings), and event is sent to App with the settings content. 
 */

export default {
  name: 'Settings',
  data() {
    return {
      settings: {
        url:null,
        username:null,
        password:null,
        wantSlot:null,
      },
      message:""
    }
  },
  //Save settings in Local Storage
  methods: {
    checkConnection: function(){
      //check connection by getting user settings from server
      doesUserWantASlot(this.settings)
      .then(response =>{
        this.settings.wantSlot=response.data;
        this.message="Connection is working, settings now used on this site."
        this.sendSettingsEvent()
      })
      .catch(function (error) {
        this.message="Connection problem: "+error
      }.bind(this))
    }, 
    sendSettingsEvent(){      
        this.$emit('settings', JSON.stringify(this.settings))
    },
    changedWantSlot: function(e){
      console.log("changing wantSlot to "+e.value)
      this.settings.wantSlot=e.value
      //first save on localStorage
      localStorage.wantSlot = this.settings.wantSlot;
      //then on server
      saveUserWantASlot(this.settings, this.settings.wantSlot)
      .then(() => {      
          console.log("saved wantSlot - updating settings")
          //then send event
          this.sendSettingsEvent();
      })
        .catch(function (error) {
          console.log("error in saving user wants a slot: "+error)
        }.bind(this))
    }
  },
  mounted() {
    this.settings=loadSettingsFromStorage()

    //also reload want slot from server, to be sure it is synchronized
    doesUserWantASlot(this.settings)
      .then(response => {     
        console.log("got updated wantSlot from server: "+response.data) 
        if(this.settings.wantSlot!=response.data){
            console.log("There was a mismatch between storage and server data, updating ")
            //update value in data + local storage
            this.settings.wantSlot=response.data;
            localStorage.wantSlot = this.settings.wantSlot;
          }
      })
        .catch(function (error) {
          console.log("error in getting user wants a slot: "+error)
        }.bind(this))
  },
  watch: {
    settings(s) {
      localStorage.url = s.url;
      localStorage.username = s.username;
      localStorage.password=s.password;
      localStorage.wantSlot=s.wantSlot;
    }
  }
}
</script>

<style src="../style.css"/>