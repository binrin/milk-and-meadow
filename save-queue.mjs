// Coalesce writes outside the input event. Never postpone a pending deadline.
export function createSaveQueue(write,{delay=300,setTimer=setTimeout,clearTimer=clearTimeout}={}){
 let timer=null;
 function flush(){if(timer!==null){clearTimer(timer);timer=null;}write();}
 return {schedule(){if(timer===null)timer=setTimer(()=>{timer=null;write();},delay);},flush};
}
