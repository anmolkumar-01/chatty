import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {

  const {authUser , isUpdatingProfile , updateProfile} = useAuthStore()
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async(e)=>{

    const file = event.target.files[0];
    if(!file) return;

    // send file to the backend ( in the image form)
    const formData = new FormData();
    formData.append("profilePic",file);

    await updateProfile(formData)
    
    // set image on the profile ( only url can be setted)
    const imageURL = URL.createObjectURL(file);
    setSelectedImg(imageURL);
    

  }

  return (

    <div className="h-screen pt-20">

      <div className="max-w-2xl mx-auto p-4 py-8">

        <div className="bg-base-300 rounded-xl p-6 space-y-8">

          {/* profile header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>


          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">

            {/* circular section */}
            <div className="relative">

              {/* image */}
              <img
                src={selectedImg || authUser.data.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                {/* camera icon */}
                <Camera className="w-5 h-5 text-base-200" />

                {/* taking input and handling submit */}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />

              </label>

            </div>

            {/* if uploading on cloudinary then show uploading */}
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>

          </div>
          

          {/* ------ view only section : username and email ------*/}
          <div className="space-y-6">
            
            {/*  full name from user's database entry*/}
            <div className="space-y-1.5">

              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.data.fullName}</p>

            </div>
            
            {/* email address from users database entry*/}
            <div className="space-y-1.5">

              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>

              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.data.email}</p>
            </div>

          </div>

            {/* ----- extra account informations ------ */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">

            <h2 className="text-lg font-medium  mb-4">Account Information</h2>

                {/* accouond informations */}

            <div className="space-y-3 text-sm">

              {/* member since */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>

                <span>{authUser.data.createdAt?.split('T')[0]}</span>
              </div>
              
              {/* account status */}
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}

export default ProfilePage