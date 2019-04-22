<template>
  <div class="manageSlots">
      <h1>Manage Your Slots</h1>
   
   <p>Your parking slots</p>
  <table class="list">
    <thead>
        <th>Name</th>
        <th>Description</th>
        <th>Area</th>
    </thead>
    <tr v-for="slot in this.slots" v-bind:key="slot.id">
      <td>{{slot.name}}</td>
      <td>{{slot.desc}}</td>
      <td>{{findAreaNameById(slot.areaId)}}</td>
      <td> <b-button v-on:click="editSlot(slot)">Edit</b-button></td>
      <td> <b-button v-on:click="deleteSlot(slot)">Delete</b-button></td>
    </tr>
  </table>
 <b-button v-on:click="addSlot()">Add a new slot</b-button>

<!--Edit modal window -->
<div v-if="showEdit" class="modal-mask">
    <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <h3>Edit Slot</h3>
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">              
                <p>Name: <input v-model="slot.name"></p>
                <p>Description: <input v-model="slot.desc"></p>
                <p>
                  <select class="form-control" v-model="slot.areaId">
                    <option v-for="area in this.areas" v-bind:value="area.id" v-bind:key="area.id">
                      {{area.name}} <template v-if="area.desc">({{area.desc}})</template>
                    </option>
                  </select>
                </p>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <b-button class="modal-default-button" @click="showEdit = false">
                Cancel
              </b-button>
              <b-button class="modal-default-button" @click="saveSlot">
                Save
              </b-button>
            </slot>
          </div>
        </div>
    </div>
</div>

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
      slot: null, 
      showEdit: false,
      areas: [],
    }
  },
  methods: {    
    editSlot: function(slot){
      console.log("editing slot "+JSON.stringify(slot))
      this.slot=slot
      this.showEdit=true

    },
    addSlot: function(){
      var newSlot={
        "name": "",
        "desc": "",
        "areaId": null,
        "owner": this.settings.username
      }
      this.slots.push(newSlot)
      //this.slot=this.slots[this.slots.lemgth-1]
      this.slot=newSlot
      this.showEdit=true

    },
    deleteSlot: function(slot){
      console.log("deleting slot "+JSON.stringify(slot))
       axios.delete(this.settings.url + "/slots/"+slot.id,
         {
         auth: {
          username: this.settings.username,
          password: this.settings.password
        }, 
        withCredentials: true
        }
      )
      .then(response => {       
        console.log("deleted slot: "+JSON.stringify(response.data))
        this.slots.splice( this.slots.indexOf(slot), 1 );
        this.slot=null
        this.showEdit=false
    })
      .catch(function (error) {
        console.log("error in deleting slot: "+error)
      }.bind(this))
    },
    saveSlot: function(){
      console.log("saving slot "+JSON.stringify(this.slot))
      if(this.slot.id){
        //update
        axios.put(this.settings.url + "/slots/"+this.slot.id,
         this.slot, 
         {
         auth: {
          username: this.settings.username,
          password: this.settings.password
        }, 
        withCredentials: true
        }
      )
      .then(response => {       
        console.log("updated slot, response="+JSON.stringify(response))
        this.showEdit=false
    })
      .catch(function (error) {
        console.log("error in creating slot: "+error)
      }.bind(this))
      
      }
      else{
        //create
         axios.post(this.settings.url + "/slots/",
         this.slot, 
         {
         auth: {
          username: this.settings.username,
          password: this.settings.password
        }, 
        withCredentials: true
        }
      )
      .then(response => {       
        console.log("created slot: "+JSON.stringify(response.data))
        this.slot.id=response.data.id
        this.showEdit=false
    })
      .catch(function (error) {
        console.log("error in creating slot: "+error)
      }.bind(this))
      }
    }, 
    findAreaNameById: function(id){
      var myArea=this.areas.find(
        function(el){
          return el.id===id
        }
      );
      if(myArea){
        return myArea.name;
      }
      else{
        return ""
      }
    }
  },
  mounted: function(){
//load areas
    console.log("loading areas");
      axios.get(this.settings.url + "/areas", {
         auth: {
          username: this.settings.username,
          password: this.settings.password
        }, 
        withCredentials: true
      }
      )
      .then(response => {       
        this.areas=response.data;
        console.log("loaded areas: "+JSON.stringify(this.areas))
    })
      .catch(function (error) {
        console.log("error in getting areas: "+error)
      }.bind(this))

    //load slots
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
        //console.log("received slots: "+JSON.stringify(response))
        this.slots=response.data;
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

.list{
  width: 98%
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
