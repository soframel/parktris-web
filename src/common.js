
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
  if(localStorage.wantSlot){
    settings.wantSlot=localStorage.wantSlot

    //some browsers only support Strings for local storage. Transform back to boolean.
    if(settings.wantSlot==="true"){
      settings.wantSlot=true
    }
    else if(settings.wantSlot==="false"){
      settings.wantSlot=false
    }
  }
  return settings;
}
