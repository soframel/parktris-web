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
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  props: {
  },
  components: {
  },
   methods: {
    showSettings: function(){
      alert("showSettings");
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
