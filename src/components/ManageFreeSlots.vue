<template>
  <div class="manageFreeSlots">
      <h1>Free Slots</h1>
   
   <p>Your free slots:</p>
  <table class="list">
    <thead>
        <th>Place</th>
        <th>Start Date</th>
        <th>End Date</th>
    </thead>
    <tr v-for="decl in this.decls" v-bind:key="decl.id">
      <td>{{findSlotDescById(decl.slotId)}}</td>
      <td>{{callFormatDate(decl.startDate)}}</td>
      <td>{{callFormatDate(decl.endDate)}}</td>      
       <td> <b-button v-on:click="editDecl(decl)" variant="outline-primary"><img src="../assets/pencil.svg" alt="edit this declaration"/></b-button>
      <b-button v-on:click="deleteDecl(decl)" variant="outline-primary"><img src="../assets/trash.svg" alt="delete this declaration"/></b-button></td>
    </tr>
  </table>

 <b-button v-on:click="addDecl()" variant="outline-primary"><img src="../assets/plus.svg" alt="Add a declaration"/></b-button>

<!--Edit modal window -->
<div v-if="showEdit" class="modal-mask">
    <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <h3>Free Slot Declaration</h3>
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">                          
                <p>
                  <select class="form-control" v-model="decl.slotId">
                    <option v-for="slot in this.slots" v-bind:value="slot.id" v-bind:key="slot.id">
                      {{findSlotLabel(slot)}}
                    </option>
                  </select>
                </p>
                <!--todo: start date, end date -->
                <p>Start date: <datepicker v-model="decl.startDate" name="startDate" :monday-first="true"></datepicker></p>
                <p>End date: <datepicker v-model="decl.endDate" name="endDate" :monday-first="true"></datepicker></p>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <b-button class="modal-default-button" @click="showEdit = false">
                Cancel
              </b-button>
              <b-button class="modal-default-button" @click="saveDecl">
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

import Datepicker from 'vuejs-datepicker';
import {formatDate, findAreaNameById, getSlotLabel} from '../common'
import {loadAreas, loadSlots, loadDeclarations, deleteDeclaration, saveDeclaration, loadUsersThatWantASlot} from '../server'

export default {
  name: 'ManageFreeSlots',
  props: [
    'settings'
  ],
  data() {
    return {
      decls: null,
      decl: null, 
      showEdit: false,
      areas: [],
      slots: [],
      usersWantSlot: []
    }
  },
  components: {
    Datepicker
  },
  methods: {    
    editDecl: function(decl){
      console.log("editing decl "+JSON.stringify(decl))
      this.decl=decl
      this.showEdit=true

    },
    addDecl: function(){
      var date=new Date()
      date.setDate( date.getDate() + 1);
      var newDecl={
        "startDate": date,
        "endDate": date,
        "slotId": null,
        "owner": this.settings.username
      }
      this.decls.push(newDecl)
      this.decl=newDecl
      this.showEdit=true

    },
    deleteDecl: function(decl){
      console.log("deleting decl "+JSON.stringify(decl))
      deleteDeclaration(this.settings, decl)
      .then(response => {       
        console.log("deleted decl: "+JSON.stringify(response.data))
        this.decls.splice( this.decls.indexOf(decl), 1 );
        this.decl=null
        this.showEdit=false
    })
      .catch(function (error) {
        console.log("error in deleting decl: "+error)
      }.bind(this))
    },
    saveDecl: function(){
      console.log("saving declaration "+JSON.stringify(this.decl))
      saveDeclaration(this.settings, this.decl)
      .then(response => {       
        console.log("saved decl: "+JSON.stringify(response.data))
        this.decl.id=response.data.id
        this.showEdit=false
      })
      .catch(function (error) {
        console.log("error in creating decl: "+error)
      }.bind(this))      
    }, 
  
    findSlotDescById: function(id){
       var mySlot=this.slots.find(
        function(el){
          return el.id===id
        }
      );
      if(mySlot){
        var areaName=findAreaNameById(this.areas, mySlot.areaId);
        console.log("found slot: "+mySlot.name+", area="+mySlot.areaId+" -> found area="+areaName)
        return getSlotLabel(mySlot, areaName)
      }
      else{
        return ""
      }
    },
    callFormatDate: function(date){
      return formatDate(date)
    },
    findSlotLabel: function(slot){
       var areaName=findAreaNameById(this.areas, slot.areaId);
      return getSlotLabel(slot, areaName)
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
    console.log("loading areas");
      loadAreas(this.settings)
      .then(response => {       
        this.areas=response.data;
        console.log("loaded areas: "+JSON.stringify(this.areas))
    })
      .catch(function (error) {
        console.log("error in getting areas: "+error)
      }.bind(this))

    //load slots
    console.log("loading slots, URL="+this.settings.url+", username="+this.settings.username);
     loadSlots(this.settings)
      .then(response => {       
        //console.log("received slots: "+JSON.stringify(response))
        this.slots=response.data;
    })
      .catch(function (error) {
        console.log("error in getting slots: "+error)
      }.bind(this))
    
    //load declarations
    console.log("loading declarations");
    loadDeclarations(this.settings)
      .then(response => {       
        //console.log("received slots: "+JSON.stringify(response))
        this.decls=response.data;
    })
      .catch(function (error) {
        console.log("error in getting decls: "+error)
      }.bind(this))



    //load users that want a slot
    loadUsersThatWantASlot(this.settings)
    .then(response => {       
        this.usersWantSlot=response.data;
    })
      .catch(function (error) {
        console.log("error in getting usrs that want a slot: "+error)
      }.bind(this))

    }
    
}
</script>

<style src="../style.css"/>
