<template>
  <div class="manageSlots">
      <h1>Manage Your Slots</h1>
   
   <p>Your parking slots</p>
  


  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'ManageSlots',
  props: [
    'settings'
  ],
  data() {
    return {
      slots: null,
      slot: null
    }
  },
  methods: {    
  },
  mounted: function(){
    console.log("loading slots, URL="+this.settings.url+", username="+this.settings.username);
      axios.get(this.settings.url + "/slots?owner="+this.settings.username, {
         auth: {
          username: this.settings.username,
          password: this.settings.password
        }, 
        withCredentials: true
      }
      )
      .then(response => {       
        console.log("received slots: "+response)
    })
      .catch(function (error) {
        console.log("error in getting slots: "+error)
      }.bind(this))
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
