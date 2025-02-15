import { useRef } from "react"

export function TextQueryImage({ wss }: { wss: WebSocket }) {
    let refInput = useRef<HTMLInputElement>(null)

    return <>
        <input type="text" ref={refInput} defaultValue={'iherb'}></input>

        <button className="px-3 py-1 bg-blue-100 text-sm text-blue-800 border-blue-500 border rounded-lg" onClick={() =>{
            wss.send(JSON.stringify({
                action: 'requestAI',
                payload: {
                    clientID: 'lokloklens',
                    type: 'text-query-image',
                    query: refInput.current?.value
                }
            })) 
        }}>requestAI text-query-image</button>
    </>
}

