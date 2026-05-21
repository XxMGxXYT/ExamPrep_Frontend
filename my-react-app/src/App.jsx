import Navbar from "./components/navbar";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Navigate, Route, Routes } from "react-router-dom";
import ErrorPage from "./routes/404";
import User from "./routes/User";
import Exams from "./routes/Exams";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./context/AuthContext";
import CreateExam from "./routes/CreateExam";
import { useState } from "react";
import ExamPage from "./routes/ExamPage";
import ExamResult from "./routes/ExamResult";

export default function App() {
    const { loading, user, isAuthenticated } = useAuth()
    const [pass, setPass] = useState(false)
    if (isAuthenticated && user.userRole === "instructor" && !pass) {
        console.log("Teacher detected, granting access to create exam page.")
        setPass(true)
    } else if (isAuthenticated && user.userRole !== "instructor" && pass) {
        console.log("Non-teacher detected, revoking access to create exam page.")
        setPass(false)
    }
    return (
        <>
            {loading && <LoadingScreen />}
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/user" element={<Navigate to="/user/profile" replace />} />
                    <Route path="/user/dashboard" element={<Dashboard />} />
                    <Route path="/user/exams" element={<Exams />} />
                    <Route path="/user/profile" element={<User />} />
                    {pass && <Route path="/user/create-exam" element={<CreateExam />} />}
                    <Route path="/exam/:id" element={<ExamPage />} />
                    <Route path="/exam-result/:id" element={<ExamResult />} />
                </Route>
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </>
    )
}