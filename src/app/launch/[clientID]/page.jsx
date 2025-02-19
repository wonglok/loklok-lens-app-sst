import { SocketTest } from "@/app/_ui/SocketTest/SocketTest"
import { Resource } from "sst";

let socketURL = Resource.SocketAPI.url

export default async function Page(ctx) {

    return <>
        {/* this page should be logged in */}

        {/* Launcher + {`${ctx.params.clientID}`} */}
        This Page should be logged in to run...
        {/* developer should save this clientID for future usage. */}

        <SocketTest socketURL={socketURL} clientID={ctx.params.clientID}></SocketTest>
    </>
}