<template>
  <div id="app">
    <b-container fluid>
    <b-row>
     <b-col><router-link to="/hello">Parktris Home</router-link></b-col>
     <b-col><router-link to="/settings">Settings</router-link></b-col>
     <b-col><router-link :to="{ name: 'manageSlots', params: {'settings':this.settings}}">Manage your slots</router-link></b-col>
    </b-row>
    </b-container>   
     <!-- route outlet -->
    <router-view  @settings="settingsChanged"></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  props: {
  },
  data() {
    return {
       settings:{},
    }
  },
  components: {
  },
   methods: {
    settingsChanged: function(settingsEvent){
      //TODO: remove, for debugging only
      //console.log("settingsChanged: "+settingsEvent);
      this.settings=settingsEvent;
    }, 
    getSettings: function(){
      return this.settings;
    }
   },
   mounted() {
     //load settings when mounted
    if (localStorage.url) {
      this.settings.url = localStorage.url;
    }
     if (localStorage.username) {
      this.settings.username = localStorage.username;
    }
     if (localStorage.password) {
      this.settings.password = localStorage.password;
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
  padding: 5px;
}
</style>
