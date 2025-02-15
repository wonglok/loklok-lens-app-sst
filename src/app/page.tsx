import { SocketTest } from "@/app/_ui/SocketTest/SocketTest"
import { Resource } from "sst";

export default async function Home() {
  let socketURL = Resource.SocketAPI.url
  
  return (
    <div className="p-12">
      <SocketTest socketURL={socketURL}></SocketTest>
    </div>
  );
}
