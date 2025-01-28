import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { executeCode } from '../api';
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from '../constant';
import OutputBox from './OutputBox';
import ClientAvatar from './Avtar';
import SocketManager from '../Socket';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
export default function CodeEditor(){
    const location = useLocation();
    const {roomId} = useParams();
    const redirect = useNavigate();
    const [Editorvalue , setEditorValue] = useState("");
    const [language , setLanguage] = useState("javascript");
    const [output , setOutput] = useState("");
    const [isLoading , setIsLoading] = useState(false);
    const [isError , setIsError] = useState(false);
    const [clients , setClients] = useState([]);
    // console.log("the clients are! " , clients);
    const editorRef = useRef();
    const onMount = (editor)=>{
        editorRef.current = editor;
        if(!socketRef.current){
            console.warn("socket is not initilazed yet! ");
            return;
        }
        editor.onDidChangeModelContent(()=>{
            const updatedCode = editor.getValue();
            socketRef.current.emit("code-change" ,{updatedCode , roomId});
        })
        
        editorRef.focus;
    }
    const handleRunCode = async()=>{
        const sourceCode = editorRef.current.getValue();
        if(!sourceCode)return;  
        try {
            setIsLoading(true);
            setIsError(false);
            setOutput("");
            const response = await executeCode(language , sourceCode);
            console.log("the response from executeCode! " , response.run);
            if(response?.run){
                setOutput(response?.run.output || response?.run.stderr || "");
            }
        } catch (error) {
            console.log("the error from executeCode! " ,error);
            setIsError(true);
        }finally{
            setIsLoading(false);
        }
    }

    const languages = Object.entries(LANGUAGE_VERSIONS);
    useEffect(()=>{
        setEditorValue(CODE_SNIPPETS[language]);
    } , [language])

    //sockets 
    const socketRef = useRef(null);
    useEffect(()=>{
        socketRef.current = SocketManager.connect("http://localhost:3000" , {
            transports: ["websocket"],
        })
        socketRef.current.on("connect_error" , (error)=>handleError(error));
        socketRef.current.on("connect_failed" , (error)=>handleError(error));

        function handleError(e){
            console.log("socket error! " , e);
            redirect("/");
        }
        socketRef.current.emit("join" , {roomId , userName:location.state?.userName})
        socketRef.current.on("joined" , ({userName , clients})=>{
            if(location.state?.userName !== userName){
                alert(`${userName} has joined the room`);
            }
            setClients(clients ?clients:[]);
        })
        socketRef.current.on("code-change" , ({updatedCode , socketId})=>{
            // console.log("the updating code is! " , updatedCode);
            if(socketRef.current.id === socketId){
                return;
            }
            if(editorRef.current){
                const currentCode = editorRef.current.getValue();
                console.log("the updating code! " , updatedCode);
                if (currentCode !== updatedCode){
                    editorRef.current.setValue(updatedCode);
                }
            }
        })
        
        socketRef.current.on("disconnected" , ({socketId , userName})=>{
            alert(`${userName} has left the room`);
            setClients((prev)=>(
                prev.filter((client)=>(client.socketId !== socketId))
            ))
        })
        return ()=>{
            socketRef.current.off("joined");
            socketRef.current.off("disconnected");
            SocketManager.disconnect();
        };
    } , [redirect , roomId , location.state?.userName]);

    if(!location.state){
        <Navigate to={"/"}/>
    }
    return(
        <>
        <div 
        className="flex flex-nowrap gap-2 justify-center items-center bg-base-200 mb-1 py-2 px-4 rounded-md shadow-2xl">
        {
            clients?.map((client)=>(
                <div key={client.userName}>
                    <ClientAvatar username={client.userName}/>
                </div>
            ))
        }
        <button className="btn btn-neutral mx-2 bg-base-100">Leave</button>
        </div>
        
        <div className="flex gap-5">
        <div className="w-1/2 shadow-xl">
        <select onChange={(e)=>setLanguage(e.target.value)} className="outline-none bg-base-200 px-2 py-1 mb-1 mt-2">
            {
                languages.map(([lang , version])=>(
                    <option key={lang} value={lang}>{lang}&nbsp;{version}</option>
                ))
            }
        </select>
        <Editor 
        height="90vh"
        theme='vs-dark' 
        language={language}
        value={Editorvalue}
        onMount={onMount}
        onChange={(value)=>setEditorValue(value)}
        />
        
        </div>
        <OutputBox output={output} isError={isError} isLoading={isLoading}/>
        
        </div>
        <div className="text-center mt-2">
        <button 
        className="btn btn-neutral mx-2 bg-base-100" 
        onClick={handleRunCode}
        disabled={isLoading}
        >{isLoading ? "Running" : "RunCode"}</button>
        <button className="btn btn-neutral bg-base-100">ExplainCode</button>
        </div>
        </>
    )
}