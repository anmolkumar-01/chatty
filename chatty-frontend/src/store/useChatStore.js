import {create} from 'zustand'
import toast from 'react-hot-toast'
import {axiosInstance} from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { useEffect } from 'react';

export const useChatStore = create((set,get)=>({

    messages: [],
    users:[],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    // 1. get all users for sidebar
    getUsers: async()=>{
        set({isUsersLoading: true})

        try {
            const res = await axiosInstance.get('/messages/all-users');
            // console.log("data coming in getUsers from axios is " , res.data.data)
            set({users: res.data.data})
            
        } catch (error) {
            console.log("Error in getUsers : " , error)
        } finally{
            set({isUsersLoading: false})
        }
    },

    //2. get all the messages of a my chat with other user
    getMessages: async(userId) => {
        set({isMessagesLoading: true})
        try {
            
            const res = await axiosInstance.get(`/messages/${userId}`)
            // console.log("data coming in getMessages from axios is " , res.data.data)
            set({messages: res.data.data})

        } catch (error) {
            console.log("Error in getMessages : " , error)
        }finally{
            set({isMessagesLoading: false})
        }
    },

    // 3. send a message
    sendMessage: async(formData)=>{
        const {selectedUser, messages} = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,formData)
            // console.log("data coming in sendMessages from axios is " , res.data.data)
            set({messages: [...messages, res.data.data]})
            
             
        } catch (error) {
            console.log("Error in Send Messages : " , error)
            toast.error('Please send image files only')
        }
    },

    // for showing real time msg to receiver
    subscribeToMessages: () => {
        const {selectedUser} = get()
        if(!selectedUser) return ;

        const socket = useAuthStore.getState().socket
        socket.on('newMessage' , (newMessage) => {

            // if msg is not sent from the selected user then don't show it
            const isMsgSentFromSelectedUser = newMessage.sender == selectedUser._id
            if(!isMsgSentFromSelectedUser) return; 

            set({messages: [...get().messages, newMessage]})
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off('newMessage')
    },

    // set selected user
    setSelectedUser: (selectedUser) => set({selectedUser}),


}))