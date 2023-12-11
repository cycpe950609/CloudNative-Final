import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import "./map.css"

const MapPage = () => {
    console.log("MapPage")
    const mapEditorRed = useRef(null);
    const [iframeUrl, setIframeUrl] = useState("");
    const loadEditor = () => {
        const src = "/mapeditor/";
        setIframeUrl(src);
    };

    useEffect(() => {
        loadEditor();
        if(mapEditorRed.current) {
            (mapEditorRed.current as any).focus();
        }
        console.log("addEventListener")
        window.addEventListener("keydown", docKeydownHandler);
        window.addEventListener("keyup", docKeyupHandler);

        return () => { 
            console.log("removeEventListener")
            window.removeEventListener("keydown", docKeydownHandler);
            window.removeEventListener("keyup", docKeyupHandler);
        }

    }, []);

    const docKeydownHandler = (ev: KeyboardEvent) => {
        console.log("docKeydown", ev.key);
        if (ev.key === "Control") { ev.preventDefault(); ev.stopPropagation(); }
        if (ev.key === "Shift") { ev.preventDefault(); ev.stopPropagation(); }
        if (ev.key === "Alt") { ev.preventDefault(); ev.stopPropagation(); }
    };
    const docKeyupHandler = (ev: KeyboardEvent) => {
        console.log("docKeyup", ev.key);
        if (ev.key === "Control") { ev.preventDefault(); ev.stopPropagation(); }
        if (ev.key === "Shift") { ev.preventDefault(); ev.stopPropagation(); }
        if (ev.key === "Alt") { ev.preventDefault(); ev.stopPropagation(); }
    };
    
    return (
        <div className='w-full mapeditor' >
            <iframe 
                autoFocus
                ref={mapEditorRed}
                className='w-full mapeditor'
                src={iframeUrl}
                style={{ border: 0 }}
            ></iframe>
        </div>
    )
}

export default MapPage