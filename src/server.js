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

/**
 * load owner declarations
 */
export function loadOwnerFutureDeclarations(settings){
    return axios.get(settings.url + "/declarations/future?owner="+settings.username, {
        auth: {
         username: settings.username,
         password: settings.password
       }, 
       withCredentials: true
     }
     );
}

/** load other declarations, for users wanting to find a slot */
export function loadAvailableFreeSlotDeclarations(settings){
  return axios.get(settings.url + "/declarations/available", {
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
export function doesUserWantASlot(settings){
    return axios.get(settings.url + "/users/wantSlot/"+settings.username, {
        auth: {
         username: settings.username,
         password: settings.password
       }, 
       withCredentials: true
     }
     );
}

export function saveUserWantASlot(settings, wantSlot){
  return axios.put(settings.url + "/users/wantSlot/"+settings.username+"?want="+wantSlot, 
  wantSlot,
  {
      auth: {
       username: settings.username,
       password: settings.password
     }, 
     withCredentials: true
   }
   );
}

/******************** LOANS *************************/

export function loadLoans(settings){
  return axios.get(settings.url + "/loans?tenant="+settings.username, {
      auth: {
       username: settings.username,
       password: settings.password
     }, 
     withCredentials: true
   }
   );
}

export function saveLoan(settings, loan){
      //create
      return axios.post(settings.url + "/loans/",
       loan, 
       {
       auth: {
        username: settings.username,
        password: settings.password
      }, 
      withCredentials: true
      })
}

export function deleteLoan(settings, loan){
  return axios.delete(settings.url + "/loans/"+loan.id,
  {
  auth: {
   username: settings.username,
   password: settings.password
 }, 
 withCredentials: true
 }
);
}

