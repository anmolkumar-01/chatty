import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';

export const useAuthStore = create((set)=>({

    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async() => {

        try {
            
            const response = await axiosInstance.get("/auth/check-loggedIn");

            set({authUser: response.data})

        } catch (error) {
            console.error("Error checking authentication:", error);
            set({authUser: null});
        } 
        finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async(formData) => ({

    })
}))