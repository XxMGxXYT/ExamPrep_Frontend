/* eslint-disable react-hooks/rules-of-hooks */
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import useRefreshToken from "../hooks/UseRefreshToken";
import axios from "../api/Axios";
import { useEffect } from "react";

// Problem!
// Make the getToken function in useEffect run only once when the component mounts
// even if the component re-renders due to state changes like 'loading'

export default function ProtectedRoute() {
    const { isAuthenticated, checkTokenExp } = useAuth()
    if (isAuthenticated) {
        if (checkTokenExp() !== true) {
            return <Outlet />
        } else {
            useEffect(() => {
                const getToken = async () => {
                    try {
                        await axios.get("/refresh-token")
                    } catch (err) {
                        console.error(err.message)
                    }
                }
                getToken()
            }, [])
        }
    } else {
        useEffect(() => {
            const getToken = async () => {
                try {
                    await axios.get("/refresh-token")
                } catch (err) {
                    console.error(err.message)
                }
            }
            getToken()
        }, [])
    }
}