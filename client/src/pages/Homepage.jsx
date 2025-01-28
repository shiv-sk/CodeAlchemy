import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
export default function HomePage(){
    const newRoomId = (e)=>{
        e.preventDefault();
        const newId = uuidv4();
        setRoomId(newId);
        return newId;
    }

    const navigate = useNavigate();
    const joinRoom = ()=>{
        if(!userName || !roomId){
            return;
        }
        navigate(`/editor/${roomId}` , {
            state:{
                userName
            }
        });
    }
    const [roomId , setRoomId] = useState("");
    const [userName , setUserName] = useState("");
    return (
        <div className="flex justify-center items-center flex-col h-screen">
            
            <div className="flex flex-col items-center space-y-4 shadow-xl bg-base-200 px-8 py-14 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">CodeAlchemy</h1>
            <input 
            type="text" 
            placeholder="RoomId" 
            className="input input-bordered w-96"
            value={roomId}
            onChange={(e)=>setRoomId(e.target.value)}
            />
            <input 
            type="text" 
            placeholder="Enter your name" 
            className="input input-bordered w-96"
            value={userName}
            onChange={(e)=>setUserName(e.target.value)}
            />
            <p>generate new roomId&ensp;<span onClick={newRoomId} 
            className="cursor-pointer hover:border-b-2 text-md hover:text-primary hover:ease-in-out">NewId</span></p>
            <button 
            className="btn btn-active btn-neutral w-96"
            onClick={joinRoom}
            >Join</button>
            </div>
        </div>
    )
}