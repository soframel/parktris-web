<template>
  <div id="app">
    <b-container fluid>
    <b-row>
     <b-col><router-link to="/hello">Parktris Home</router-link></b-col>
     <b-col><router-link to="/settings">Settings</router-link></b-col>
     <b-col><router-link to="/todo">Todo</router-link></b-col>
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
       settings:null,
    }
  },
  components: {
  },
   methods: {
    settingsChanged: function(settingsEvent){
      //TODO: remove, for debugging only
      console.log("settingsChanged: "+settingsEvent);
      this.settings=settingsEvent;
    }
   }
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
