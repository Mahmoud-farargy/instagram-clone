import React, { useRef, useState, useEffect } from 'react';
import { FaYoutube } from "react-icons/fa";

function YoutubeItem({thumbnail, index}) {
    const ytRef = useRef(null);
    const [ hasError, setError] = useState(false);
    useEffect(() => {
        if(ytRef.current){
            ytRef.current.addEventListener("error", () => {
                setError(true);
            });
        }
    }, []);
    return (
        <div className="users__profile__image" >      
        {
            !hasError ?
             <img style={{height: "100%"}} ref={ytRef} src={thumbnail} onError={() => setError(true)} loading="lazy" alt={`post #${index}`} />:
             <div className="youtube--thumbnail--error">
                <FaYoutube />  
             </div>
        }
        </div>

      
    )
}

export default YoutubeItem; 