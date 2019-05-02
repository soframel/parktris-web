<template>
  <div class="borrowSlots">
      <h1>Borrow parking slots</h1>
   
   <p>These are the slots you can borrow: </p>
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
       <td> <b-button v-on:click="borrow(decl)" variant="outline-primary">Borrow</b-button></td>
    </tr>
  </table>

  <br/>
  <p>These are the slots you have already borrows (in the future):</p>
  <!--TODO: existing loans-->



<!--Edit modal window -->
<div v-if="showEdit" class="modal-mask">
    <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <h3>Borrow a Slot</h3>
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">                          
                <p>Start date: <datepicker v-model="loan.startDate" name="startDate" :monday-first="true" :disabledDates="disabledStartDates"></datepicker></p>
                <p>End date: <datepicker v-model="loan.endDate" name="endDate" :monday-first="true"  :disabledDates="disabledEndDates"></datepicker></p>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <b-button class="modal-default-button" @click="showEdit = false">
                Cancel
              </b-button>
              <b-button class="modal-default-button" @click="saveLoan">
                Confirm
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
import {loadAreas, loadSlots, loadAvailableFreeSlotDeclarations} from '../server'

export default {
  name: 'BorrowSlots',
  props: [
    'settings'
  ],
  data() {
    return {
      decls: null,
      slots: null, 
      areas: null,
      showEdit: false,
      loan: null, 
      disabledStartDates: null,
      disabledEndDates: null
    }
  },
  components: {
    Datepicker
  },
  methods: {    
   
    findSlotDescById: function(id){
      if(this.slots){
        var mySlot=this.slots.find(
          function(el){
            return el.id===id
          }
        );
        if(mySlot){
          var areaName=findAreaNameById(this.areas, mySlot.areaId);
          return getSlotLabel(mySlot, areaName)
        }
        else{
          return ""
        }
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
    },
    borrow: function(decl){
      //TODO
      this.loan={
        startDate: decl.startDate, 
        endDate: decl.endDate
        }
      var lastDisabled=new Date(decl.startDate)
      var firstDisabled=new Date(decl.endDate)
      this.disabledStartDates={
        to: lastDisabled
      }
      this.disabledEndDates={
        from: firstDisabled
      }
      this.showEdit=true
      console.log("borrowing a slot for decl="+JSON.stringify(decl))
    }, 
    saveLoan: function(){
      this.showEdit=false
      console.log("saving loan "+this.loan)

      //this.loan=null
    }
  },
  mounted: function(){
    //redirect if no server settings
    if(!this.settings){
      this.$router.push('hello')
    }
    else{
    //load areas
      loadAreas(this.settings)
      .then(response => {       
        this.areas=response.data;
    })
      .catch(function (error) {
        console.log("error in getting areas: "+error)
      }.bind(this))

    //load slots
     loadSlots(this.settings)
      .then(response => {       
        this.slots=response.data;
    })
      .catch(function (error) {
        console.log("error in getting slots: "+error)
      }.bind(this))
    
    //load available declarations
    loadAvailableFreeSlotDeclarations(this.settings)
      .then(response => {       
        this.decls=response.data;
    })
      .catch(function (error) {
        console.log("error in getting available free slots decls: "+error)
      }.bind(this))
    
    }
    }    
}
</script>

<style src="../style.css"/>
