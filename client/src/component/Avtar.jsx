/* eslint-disable react/prop-types */
import Avatar from 'react-avatar';
export default function ClientAvatar({username}){
    return(
        <div className="text-lg">
            <Avatar name={username} size="60" round={true}/>
        </div>
        
    )
}