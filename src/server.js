import axios from 'axios';

/************* AREAS **************/

export function loadAreas(settings){
    return  axios.get(settings.url + "/areas", {
        auth: {
         username: settings.username,
         password: settings.password
       }, 
       withCredentials: true
     }
     );
}

/************* SLOTS  **************/

export function loadSlots(settings){
    return axios.get(settings.url + "/slots?owner="+settings.username, {
        auth: {
         username: settings.username,
         password: settings.password
       }, 
       withCredentials: true
     }
     );
}

export function deleteSlot(settings, slot){
    return axios.delete(settings.url + "/slots/"+slot.id,
         {
         auth: {
          username: settings.username,
          password: settings.password
        }, 
        withCredentials: true
        })
}

export function saveSlot(settings, slot){
    if(slot.id){
        //update
        return axios.put(settings.url + "/slots/"+slot.id,
         slot, 
         {
         auth: {
          username: settings.username,
          password: settings.password
        }, 
        withCredentials: true
        })      
      }
      else{
        //create
        return axios.post(settings.url + "/slots/",
         slot, 
         {
         auth: {
          username: settings.username,
          password: settings.password
        }, 
        withCredentials: true
        })
    }
}

/***************** FREE SLOTS DECLARATIONS ******************/

export function loadDeclarations(settings){
    return axios.get(settings.url + "/declarations?owner="+settings.username, {
        auth: {
         username: settings.username,
         password: settings.password
       }, 
       withCredentials: true
     }
     );
}

export function deleteDeclaration(settings, decl){
    return axios.delete(settings.url + "/declarations/"+decl.id,
    {
    auth: {
     username: settings.username,
     password: settings.password
   }, 
   withCredentials: true
   }
 );
}

export function saveDeclaration(settings, decl){
    if(decl.id){
        //update
        return axios.put(settings.url + "/declarations/"+decl.id,
         decl, 
         {
         auth: {
          username: settings.username,
          password: settings.password
        }, 
        withCredentials: true
        }
      );
      
      }
      else{
        //create
        return axios.post(settings.url + "/declarations/",
         decl, 
         {
         auth: {
          username: settings.username,
          password: settings.password
        }, 
        withCredentials: true
        }
      );
    }
}

/***************** USERS WANTING SLOTS ******************/
export function loadUsersThatWantASlot(settings){
    return axios.get(settings.url + "/users/wantSlot", {
        auth: {
         username: settings.username,
         password: settings.password
       }, 
       withCredentials: true
     }
     );
}

/*
 console.log("fetching users that want a slot");
    fetch(serverUrl+'/users/wantSlot', {              
      method: 'GET',
      headers: {
        'Authorization': buildToken(login, password)
      }
    })
*/