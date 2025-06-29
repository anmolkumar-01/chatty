import { useChatStore } from "../store/useChatStore"
import { useEffect,useRef } from "react"
import { useAuthStore } from '../store/useAuthStore'
import MessageSkeleton from './skeletons/MessageSkeleton'

import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"

const ChatContainer = () => {

  const {messages , isMessagesLoading , getMessages , selectedUser} = useChatStore()
  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(()=>{
    
    console.log("selected user is " , selectedUser)

    getMessages(selectedUser._id);
    
  },[selectedUser._id, getMessages])

  
  if(isMessagesLoading){
    return(
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
  )}
  // console.log("messages are here" , messages)

  return (

    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      Messages are loading....

      <MessageInput />

    </div>

  )
}

export default ChatContainer