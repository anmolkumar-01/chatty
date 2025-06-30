import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from "react-hot-toast";
import {io} from 'socket.io-client'

const BACKEND_URL='http://localhost:5000'

export const useAuthStore = create((set,get)=>({

    authUser: false,

    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    // ----- for socket.io ---
    onlineUsers: [],
    socket: null,

    // signup fxn
    signup: async(formData) => {

        set({isSigningUp: true});
        try {
            
            const res = await axiosInstance.post("/auth/signup",formData);
            // console.log("data coming in signup route from axios is " , res)
            set({authUser: res.data});
            toast.success("Account created successfully");

            get().connectSocket()

        } catch (error) {
            console.log("Error is signup : " , error)
            toast.error(error.respose.data.message)
        }finally{
            set({isSigningUp: false})
        }

    },

    // login function
    login: async(formData)=>{

        set({isLoggingIn: true});
        try {
            
            const res = await axiosInstance.post("/auth/login",formData);
            // console.log("data coming in login route from axios is " , res);

            set({authUser: res.data})
            toast.success("You successfully logged In")

            // --------- socket.io -------
            get().connectSocket()
            
        } catch (error) {
            console.log("Error is logingIn : " , error)
            toast.error(error.respose.data.message)
        } finally{
            set({isLoggingIn: false})
        }
    },

    // logout fxn
    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null})
            toast.success("User successfully logged out");

            get().disconnectSocket()
        } catch (error) {
            toast.error(error.respose.data.message)
        }
    },
    
    // updating the profilePic fxn
    updateProfile: async(formData) => {
        set({isUpdatingProfile: true})

        try {
            
            const res = await axiosInstance.put("/auth/update-profile",formData)
            // console.log("data coming in update-profile fxn from axios is " , res);

            set({authUser: res.data})
            toast.success("Profile Photo successfully updated")

        } catch (error) {
            console.log("Error is logingIn : " , error)
            toast.error(error.respose.data.message)
        } finally{
            set({isUpdatingProfile: false})
        }
    },

    // check loggedin/auth fxn
    checkAuth: async() => {

        try {
            
            const res = await axiosInstance.get("/auth/check-loggedIn");
            // console.log("data coming in check logged in route authStore in store from axios is " , res)

            set({authUser: res.data})
            get().connectSocket()

        } catch (error) {
            console.error("Error checking authentication:", error);
            set({authUser: null});
        } 
        finally {
            set({isCheckingAuth: false});
        }
    },

    // ------- Socket io functions
    connectSocket: ()=>{
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return ;

        const socket = io(BACKEND_URL , { query: {userId: authUser.data._id}})
        socket.connect()
        set({socket: socket})

        // listen for all online users
        socket.on('getOnlineUsers', (userIds) => {
            set({onlineUsers: userIds})
        })
    },

    disconnectSocket: ()=>{
        if(get().socket?.connected) get().socket.disconnect();

    },

}))


