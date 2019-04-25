import axios from 'axios';

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