import React, { useState,useRef } from 'react'
import {X, Send, Image} from 'lucide-react'
import Toast from 'react-hot-toast'
import { useChatStore } from '../store/useChatStore'

const MessageInput = () => {

  const [text , setText] = useState("")
  const [imageFile , setImageFile] = useState(null) // for sending file to the multer in form of file
  const [imagePreview , setImagePreview] = useState("")
  const fileInputRef = useRef(null)
  const {sendMessage} = useChatStore()

  const handleImagePreview = (e) => {
    const file = e.target.files[0];

    if(!file.type.startsWith("image/")){
      Toast.error("Please select an image file")
      return;
    }

    setImageFile(file)
    // set image on the profile ( only url can be setted)
    const imageURL = URL.createObjectURL(file);
    setImagePreview(imageURL);

  }

  const removeImage = () => {
    setImagePreview(null)
    if(fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSendMessage = async(e) => {
    e.preventDefault()

    // if both are not available
    if(!text.trim() && !imagePreview) return ;
    
    try {

      // i have to send images in file objects - due to multer 
      const formData = new FormData();
      formData.append("text", text);
      formData.append("image", imageFile); // imageFile should be a File object (from input)
      
      await sendMessage(formData)

      // clear form
      setText("")
      setImagePreview(null)
      setImageFile(null)
      
      if(fileInputRef.current) fileInputRef.current.value = ""
      
    } catch (error) {
      console.error("Failed to send message: " , error);
    }
  }

  return (

    <div className="p-4 w-full">

      {/*  -------- mini image preview icon ------------ */}
      {imagePreview && (

        <div className="mb-3 flex items-center gap-2">

          <div className="relative">

            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />

            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>

          </div>

        </div>
        
      )}


      {/* ------------ lower inputs -------------- */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        

        {/*  text and image inputs  */}
        <div className="flex-1 flex gap-2">

          {/* text input */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

           {/* file input button functionality - hidden*/}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImagePreview}
            />

              {/* file input icon button*/}
            <button
              type="button"
              className={`hidden sm:flex btn btn-circle
                      ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={20} />
            </button>
          
        </div>

          {/*  send message button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={18} />
        </button>

      </form>

    </div>

  )
}

export default MessageInput