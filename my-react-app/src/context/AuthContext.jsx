/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode"
import axios from "../api/Axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext) || false

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(null || window.localStorage.getItem("accessToken"))
    const [user, setUser] = useState(null || (token ? jwtDecode(token) : null))
    const [loading, setLoading] = useState(false)
    const [exams, setExams] = useState([]);
    const [examsResults, setExamsResults] = useState([]);
    const [teachersDashBoard, setTeachersDashBoard] = useState({})
    const isAuthenticated = (!!user && !!token) ? true : false || false
    const ref = useRef(false)
    const navigate = useNavigate()

    const reload = () => {
        window.location.reload()
    }

    // Get all exams results
    useEffect(() => {
        const fetchExamsResults = async () => {
            try {
                const response = await axios.get("/results");
                // console.log("Exams results data fetched successfully:", response.data.data);
                setExamsResults(response.data.data);
            } catch (err) {
                console.error("Error fetching exams results:", err);
            }
        }
        fetchExamsResults();
    }, [])

    // Create a function to check if an exam id is in the results objects or not, and return the status of the exam for the user.
    const checkExamStatus = (examId) => {
        // Check first if there is results or not, if there is no results, return false.
        if (examsResults.length === 0 || !examsResults) return false;
        // Check on the token
        if (!token) return false;
        // check if the exam id is in the user's taken exams
        const user = jwtDecode(token)
        const examResult = examsResults.find((result) => result.examId === examId && result.studentId === user.userId)
        return examResult ? true : false;
    };

    useEffect(() => {
        if (ref.current) return;
        ref.current = true;
        // If there is an access token in the localstorage on loading.
        // First check if it's expired or not.
        const localToken = window.localStorage.getItem("accessToken")
        if (localToken) {
            const currentTime = Date.now() / 1000
            const tokenDate = jwtDecode(localToken).exp
            if (currentTime > tokenDate) {
                // Token expired
                // Try to get one
                console.log("Token expired, but try to get one.")
                const getToken = async () => {
                    try {
                        setLoading(true)
                        const res = await axios.get("/refresh-token")
                        login(res.data.accessToken)
                    } catch (err) {
                        logout()
                        console.error(err.message)
                    } finally {
                        setLoading(false)
                    }
                }
                getToken()
            } else {
                // Token not expired
                // Set user and token
                setToken(localToken)
                setUser(jwtDecode(localToken))
            }
        } else {
            // If token isn't exist, try to get one using the refresh token
            console.log("There is no token, but try to get one.")
            const getToken = async () => {
                try {
                    setLoading(true)
                    const res = await axios.get("/refresh-token")
                    login(res.data.accessToken)
                } catch (err) {
                    console.error(err.message)
                } finally {
                    setLoading(false)
                }
            }
            getToken()
        }
        axios.interceptors.request.use((config) => {
            console.log("Request intercepted");
            // Set loading to true in any request beggining
            setLoading(true)
            config.headers.Authorization = `Bearer ${window.localStorage.getItem("accessToken")}`
            return config;
        }, (error) => {
            console.log("Request intercepted and failed");
            return Promise.reject(error);
        });

        axios.interceptors.response.use((response) => {
            console.log("Response intercepted but worked");
            // If there is an access token in the response
            if (response?.data?.accessToken) {
                // Set new access token in state and localstorage
                setToken(response.data.accessToken)
                window.localStorage.setItem("accessToken", response.data.accessToken)
                // Set user
                setUser(jwtDecode(response.data.accessToken))
            }
            // Set loading to false when response is received
            setLoading(false)
            return response;
        }, (error) => {
            console.log("Response intercepted and failed");
            setLoading(false)
            if (error.status === 401 || error.status === 403) {
                // Set loading to false and logout the user
                setLoading(false)
                setToken(null)
                setUser(null)
                setExamsResults([])
                window.localStorage.removeItem("accessToken")
                navigate("/login")
                throw Error("Unauthorized access, please login in!")
            }
            return Promise.reject(error);
        })
    }, [navigate]);

    // Get exams data.
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get("/exams");
                console.log("Exams data fetched successfully:", response.data.data);
                setExams(response.data.data.reverse()); // Reverse to show most recent exams first
            } catch (err) {
                console.error("Error fetching exams:", err);
            }
        };

        fetchExams();
    }, []);

    const login = (accessToken) => {
        if (accessToken) {
            // Remove the old token if exist
            if (window.localStorage.getItem("accessToken")) {
                window.localStorage.removeItem("accessToken")
            }
            setToken(accessToken)
            // Set token to localStorage
            window.localStorage.setItem("accessToken", accessToken)
            // Set user
            setUser(jwtDecode(accessToken))
        } else {
            return;
        }
    }

    const logout = async () => {
        // Remove refresh token from cookies
        try {
            await axios.get("/logout")
            setToken(null)
            setUser(null)
            window.localStorage.removeItem("accessToken")
        } catch (err) {
            console.error(err.message)
        }
    }

    const checkTokenExp = () => {
        if (token) {
            const currentTime = Date.now() / 1000
            const tokenDate = jwtDecode(token).exp
            if (currentTime > tokenDate) {
                return true // token expired
            } else {
                return false // token not expired
            }
        }
    }

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, loading, login, logout, checkTokenExp, setLoading, user, exams, examsResults, checkExamStatus, reload, setUser, teachersDashBoard, setTeachersDashBoard, setExamsResults }}>
            {children}
        </AuthContext.Provider>
    )
};