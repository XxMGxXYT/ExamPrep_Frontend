import { Box, Button, Container, FormControl, FormLabel, Input, Heading, Text, Select, useToast, RadioGroup, Radio } from "@chakra-ui/react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "../api/Axios"

export default function Register() {

    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    if (isAuthenticated) {
        navigate("/user")
    }

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        major: "",
        password: "",
        confirmPassword: "",
        role: "student" // default role set to student
    })

    const toast = useToast()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handlSubmuit = async (e) => {
        e.preventDefault()
        try {

            // Validate password and confirm password
            if (formData.password !== formData.confirmPassword) {
                // Create a toast notification
                toast({
                    title: "Password Mismatch",
                    description: "The password and confirm password fields do not match.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                })
                return
            }

            // Validate required fields
            if (!formData.email || !formData.password || !formData.confirmPassword) {
                toast({
                    title: "Missing Required Fields",
                    description: "Please fill in all required fields.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                })
                return
            } else if (formData.password.length < 7) {
                toast({
                    title: "Weak Password",
                    description: "Password should be at least 6 characters long.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                })
                return
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                toast({
                    title: "Invalid Email",
                    description: "Please enter a valid email address.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                })
                return
            } else if (formData.username.length > 20) {
                toast({
                    title: "Username Too Long",
                    description: "Username should not exceed 20 characters.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                })
                return
            } else if (formData.major.length > 30) {
                toast({
                    title: "Major Too Long",
                    description: "Major should not exceed 30 characters.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                })
                return
            }
            // Validate username if not exists
            if (!formData.username) {
                formData.username = "User" + Math.floor(Math.random() * 10000)
            }
            // Send form data to the server
            const response = await axios.post("/register", formData)

            // Handle response
            if (response.status === 201) {
                toast({
                    title: "Registration Successful",
                    description: "Your account has been created successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                })
                // Redirect to login page after successful registration
                navigate("/login")
                // Reset form
                setFormData({
                    email: "",
                    username: "",
                    major: "",
                    password: "",
                    confirmPassword: "",
                    role: "student"
                })
            }
        } catch (err) {
            console.error(err.message)
            if (err.status === 409) {
                toast({
                    title: "Registration Failed",
                    description: "Email already exists.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                })
            } else {
                toast({
                    title: "Registration Failed",
                    description: "There was an error creating your account. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                })
            }
        }
    }

    return (
        <Container maxW="container.lg" py={8}>
            <Heading as="h1" mt="4rem" mb={10} textAlign="center">Create your account</Heading>
            <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" maxW="500px" m="auto">
                <form onSubmit={handlSubmuit} method="post" id="regForm" action="/register">
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input onChange={handleChange} value={formData.email} bg="white" name="email" type="email" placeholder="Enter your email" _placeholder={{ color: "#000" }} mb={4} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input onChange={handleChange} value={formData.username} bg="white" name="username" type="text" placeholder="Choose a username" _placeholder={{ color: "#000" }} mb={4} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Select major</FormLabel>
                        <Select onChange={handleChange} value={formData.major} bg="white" name="major" cursor="pointer" mb={4}>
                            <Box as="option" defaultValue="None">None</Box>
                            <Box as="option" value="Computer Science">Computer Science</Box>
                            <Box as="option" value="Quantum physics">Quantum physics</Box>
                            <Box as="option" value="Artificail Inteligance">Artificail Inteligance</Box>
                            <Box as="option" value="Cyber Security">Cyber Security</Box>
                            <Box as="option" value="Linear Algebra">Linear Algebra</Box>
                            <Box as="option" value="Basics math">Basics math</Box>
                            <Box as="option" value="Other">Other</Box>
                        </Select>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Select Role</FormLabel>
                        <RadioGroup onChange={(value) => setFormData((prev) => ({ ...prev, role: value }))} value={formData.role} mb={4}>
                            <Box display="flex" gap="20px">
                                <Radio value="student" bg="white" p="5px" borderRadius="5px" cursor="pointer">Student</Radio>
                                <Radio value="instructor" bg="white" p="5px" borderRadius="5px" cursor="pointer">Instructor</Radio>
                            </Box>
                        </RadioGroup>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input onChange={handleChange} value={formData.password} bg="white" type="password" name="password" placeholder="Enter your password" mb={4} _placeholder={{ color: "#000" }} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input onChange={handleChange} value={formData.confirmPassword} bg="white" type="password" name="confirmPassword" placeholder="Confirm your password" mb={4} _placeholder={{ color: "#000" }} />
                    </FormControl>
                    <Button type="submit" value="Register" bg="blue.500" color="white" _hover={{ bg: "blue.600" }} cursor="pointer" w="100%">Sign Up</Button>
                </form>
                <Box mt={4} fontSize="sm" textAlign="center" display="flex" justifyContent="center" gap="5px" alignItems="center">
                    <Text color="gray.500" m="0px">Already have an account?</Text>
                    <Link className="reg_link" to="/login">Log In</Link>
                </Box>
            </Box>
        </Container >
    )
}