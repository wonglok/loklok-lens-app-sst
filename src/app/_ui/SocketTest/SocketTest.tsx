'use client';

import { useEffect, useRef, useState } from "react"
// import { v4 } from "uuid";
import copy from 'copy-to-clipboard';
import WebSocket from 'reconnecting-websocket'
import { TextQueryImage } from "./TextQueryImage";
export function SocketTest({ socketURL = '' }) {
    let [status, setStatus] = useState('loading')
    let [logs, setLogs] = useState([])
    let [wss, setWss] = useState<any>(false)
    useEffect(() => {  
        if (!socketURL) {
            return
        }
        
        localStorage.setItem("clientID", `lokloklens`);

        let clientID = localStorage.getItem("clientID");

        console.log('clientID', clientID)

        let clean = () => {}

        let wss = new WebSocket(`${socketURL}?clientID=${clientID}`);

        wss.onopen = () => {
            //

            setStatus('open')

            console.log('opened')

            setWss(wss)
        }

        clean = () => {
            wss.close();
        }

        wss.onmessage = (ev) => {
            console.log('raw msg =====\n',ev.data);

            let rawString = ev.data;
            let rawJSON = JSON.parse(rawString);
            let payload = rawJSON.payload;
            let action = rawJSON.action;

            setLogs((prev): any => {
                return [...prev, JSON.stringify(rawJSON, null, 2)]
            })
        }

        return () => {
            clean()
        }
    }, [socketURL])

    return <>
        {status === 'loading' && <>
            Loading...
        </>}
        {status === 'open' && <>

            <div className="mb-3">
                <CopyBtn value={socketURL}></CopyBtn>
            </div>

            <div className="mb-3">
                {wss && <>
                    <TextQueryImage wss={wss}></TextQueryImage>
                </>}
            </div>
    
            <pre>{logs.join('\n')}</pre>
        </>}
    
    </>
}


function CopyBtn ({value = ''}) {
    let refCopy = useRef<HTMLSpanElement>(null)

    return  <div onClick={() =>{
        copy(value)
        if (refCopy.current) {
            refCopy.current.innerText = 'COPIED!'
            setTimeout(() =>{
                if (refCopy.current) {
                    refCopy.current.innerText = 'COPY LINK'
                }
            }, 5000)
        } 
    }} className="rounded-lg py-2 px-3 bg-green-200 text-green-800 cursor-pointer  flex">
        <span ref={refCopy} className="bg-green-100 px-3 text-sm py-1 mx-2 select-none">COPY LINK</span>
        
        <span className="bg-green-100 px-3 text-sm py-1 block">{value}</span>
    </div> 
}