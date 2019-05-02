<template>
  <div id="app">
    <b-container fluid>
    <b-row>
     <b-col><router-link :to="{ name: 'hello', params: {'settings':this.settings}}">Parktris Home</router-link></b-col>     
     <b-col v-if="settings.wantSlot"><router-link :to="{ name: 'borrowSlots', params: {'settings':this.settings}}">Borrow Slots</router-link></b-col>
     <b-col v-if="!settings.wantSlot"><router-link :to="{ name: 'manageFreeSlots', params: {'settings':this.settings}}">Lend a Slot</router-link></b-col>
     <b-col v-if="!settings.wantSlot"><router-link :to="{ name: 'manageSlots', params: {'settings':this.settings}}">Manage your slots</router-link></b-col>
     <b-col><router-link to="/settings">Settings</router-link></b-col>
    </b-row>
    </b-container>   
     <!-- route outlet -->
    <router-view  @settings="settingsChanged"></router-view>

  </div>
</template>

<script>

import {loadSettingsFromStorage} from './common'

/**
 * Entry point for Parktris web application. 
 * Uses routing to link to other components. 
 * Settings are managed in Settings.vue component. 
 * Settings are loaded at startup (first part from local storage, second part from server), or when receiving a "settingsChanged" event. 
 * Settings are passed to other components through router params. 
 */

export default {
  name: 'app',
  props: {
  },
  data() {
    return {
       settings:{
         url: null,
         username: null,
         password: null,
         wantSlot: null
       },
    }
  },
  components: {
  },
   methods: {
    settingsChanged: function(settingsEvent){      
      this.settings=JSON.parse(settingsEvent);
    }
   },
   beforeMount(){
     this.settings=loadSettingsFromStorage();
     console.log("App: all settings loaded. url="+this.settings.url+", wantSlot="+this.settings.wantSlot)
   },
   mounted() {
    this.$router.push({ name: 'hello', params: { settings: this.settings } })     
  },
}
</script>

<style src="./style.css"/>