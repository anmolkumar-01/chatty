import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

import {Link } from 'react-router-dom'
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {

  const {logout, authUser} = useAuthStore()

  return (

    <header
      className="border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >

      <div className="container mx-auto px-4 h-16">

        <div className="flex items-center justify-between h-full">

          {/* --- leftmost top icon takes us to home page ---*/}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">

              {/* message icon */}
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>

              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>

          </div>

          {/* ---- rightmost top setting icon and link and logout only if user is authed or logged in*/}
          <div className="flex items-center gap-2">

            {/* setting */}
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
              
            {/* logout- only for logged in users */}
            {/* {console.log("The LoggedIn user is " ,authUser)} */}

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </header>
  )
}

export default Navbar