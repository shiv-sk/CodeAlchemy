import {io} from "socket.io-client";
class socketManager{
    static socket = null;

    static connect(serverUrl , options = {}){
        if(!this.socket){
            console.log("socket is connecting !");
            this.socket = io(serverUrl , options);

            this.socket.on("connect" , ()=>{
                console.log("socket is connected !" , this.socket.id)
            })
            this.socket.on("disconnect" , ()=>{
                console.log("socket is disconnected! ");
            })
        }
        return this.socket;
    }
    static disconnect(){
        if(this.socket){
            console.log("socket is disconnecting! ");
            this.socket.disconnect();
            this.socket = null;
        }
    }
}
export default socketManager;