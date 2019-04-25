export function formatDate(date){
    console.log("formatting date "+date+", type="+typeof date)
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