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
      <td>{{callfindAreaNameById(slot.areaId)}}</td>
      <td> <b-button v-on:click="editSlot(slot)" variant="outline-primary"><img src="../assets/pencil.svg" alt="edit this slot"/></b-button>
      <b-button v-on:click="deleteSlot(slot)" variant="outline-primary"><img src="../assets/trash.svg" alt="delete this slot"/></b-button></td>
       <!-- <img src="/open-iconic/svg/icon-name.svg" alt="icon name" -->
      <!--<td> <b-button v-on:click="deleteSlot(slot)">Delete</b-button></td>-->
    </tr>
  </table>
 <!--<b-button v-on:click="addSlot()">Add a new slot</b-button>-->
 <b-button v-on:click="addSlot()" variant="outline-primary"><img src="../assets/plus.svg" alt="add a slot"/></b-button>

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

import {formatDate, findAreaNameById, getSlotLabel} from '../common'
import {loadAreas, loadSlots, deleteSlot, saveSlot} from '../server'

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
      deleteSlot(this.settings, this.slot)
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
      saveSlot(this.settings, this.slot)
      .then(response => {       
        console.log("created slot: "+JSON.stringify(response.data))
        this.slot.id=response.data.id
        this.showEdit=false
    })
      .catch(function (error) {
        console.log("error in creating slot: "+error)
      }.bind(this))      
    }, 
    callfindAreaNameById: function(id){
      return findAreaNameById(this.areas, id)
    }
  },
  beforeMount: function(){
  //redirect if no server settings
    if(!this.settings){
      this.$router.push('hello')
    }
  },
  mounted: function(){    

    //load areas
    loadAreas(this.settings)
      .then(response => {       
        this.areas=response.data;
        console.log("loaded areas: "+JSON.stringify(this.areas))
    })
      .catch(function (error) {
        console.log("error in getting areas: "+error)
      }.bind(this))

    //load slots
    loadSlots(this.settings)
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

<style src="../style.css"/>
