import { useChatStore } from "../store/useChatStore"
import { useEffect,useRef } from "react"

import { useAuthStore } from '../store/useAuthStore'
import {formatMessageTime} from '../lib/utils'

import MessageSkeleton from './skeletons/MessageSkeleton'
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"

const ChatContainer = () => {

  const {
    messages, isMessagesLoading , getMessages , selectedUser,
    subscribeToMessages, unsubscribeFromMessages} = useChatStore()

  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);

  // calling the get messages route
  useEffect( ()=>{
    
    // console.log("selected user is " , selectedUser)

    getMessages(selectedUser._id);

    subscribeToMessages();
    
    return () => unsubscribeFromMessages();
  },[getMessages,selectedUser._id, subscribeToMessages ,unsubscribeFromMessages])

  // scroll to the current messages
  useEffect(()=>{
    if(messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({behaviour: "smooth"})
  },[messages])
  
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.sender === authUser.data._id ? "chat-end" : "chat-start" }`}
            ref={messageEndRef}
          >
            {/* image circular icon */}
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender === authUser.data._id
                      ? authUser.data.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
                
            {/* showing time */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* showing images or texts chat bubble*/}
            <div className="chat-bubble flex flex-col max-w-[30%] break-words whitespace-normal">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && 
              <p>{message.text}</p>}

            </div>
      


          </div>

        ))}

      </div>

      <MessageInput />

    </div>

  )
}

export default ChatContainer