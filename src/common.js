import {doesUserWantASlot} from './server'

export function formatDate(date){
    if(typeof date !== 'string'){
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    }
    else{
        return date;
    }
}

export function findAreaNameById(areas, id){
    var myArea=areas.find(
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

export function getSlotLabel(slot, areaName){
    var slotDesc= slot.name
    if(slot.desc){
      slotDesc=slotDesc+", "+slot.desc
    }
    if(areaName){
        slotDesc=slotDesc +" ("+areaName+")";
    }
    return slotDesc
}

export function loadSettingsFromStorage(){
  var settings=Object();
  if (localStorage.url) {
    settings.url = localStorage.url;
  }
   if (localStorage.username) {
    settings.username = localStorage.username;
  }
   if (localStorage.password) {
    settings.password = localStorage.password;
  }
  return settings;
}

/**
 * load settings from local storage + wantSlot from server
 */
export function loadAllSettings(){
  var settings=loadSettingsFromStorage();

  //load if user wants slot (if settings found)
  if(settings){
    doesUserWantASlot(settings)
    .then(response => {
      settings.wantSlot=response.data;
      console.log("loaded wantSlot="+settings.wantSlot)
    })
    .catch(function (error) {
      console.log("error in getting user wants a slot: "+error)
    })
  }     
  return settings;
}