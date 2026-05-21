import { Box, Button, Container, FormControl, FormLabel, Input, Heading, Text, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "../api/Axios"
import { useAuth } from "../context/AuthContext"

export default function Login() {

    const toast = useToast()
    const { login, isAuthenticated } = useAuth()

    const navigate = useNavigate()

    if (isAuthenticated) {
        navigate("/user")
    }

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handlSubmuit = async (e) => {
        e.preventDefault()

        if (!isAuthenticated) {
            // If user not logged in
            try {
                // Send formData to the server
                const response = await axios.post("/login", formData)
                const data = response.data
                if (response.status === 200) {
                    toast({
                        title: "Login Successful",
                        description: data.message || "You have logged in successfully.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                    })
                    // Navigate to another page after successful login
                    navigate("/user");
                    // Empty formData
                    setFormData({
                        email: "",
                        password: "",
                    })
                    // Call login function from AuthContext
                    login(data.accessToken);
                    // Refresh the page to update the navbar links and show the user avatar instead of the login and register links.
                    window.location.reload();
                }
            } catch (err) {
                console.error(err.message)
                if (err.status === 401) {
                    toast({
                        title: "Unauthorized",
                        description: "Invalid email or password. Please try again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                    })
                } else {
                    toast({
                        title: "Login Failed",
                        description: "Invalid email or password. Please try again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                    })
                }
            }
        } else {
            toast({
                title: "Login prevented",
                description: "You've already logged in!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            return;
        }
    }

    return (
        <Container maxW="container.lg" py={8}>
            <Heading as="h1" mt="4rem" mb={10} textAlign="center">Ready to show what you know? Let’s get started!</Heading>
            <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" maxW="500px" m="auto">
                <form onSubmit={handlSubmuit} method="post" action="/login">
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input onChange={handleChange} value={formData.email} bg="white" name="email" type="email" placeholder="Enter your email" _placeholder={{ color: "#000" }} mb={4} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input onChange={handleChange} value={formData.password} bg="white" type="password" name="password" placeholder="Enter your password" mb={4} _placeholder={{ color: "#000" }} />
                    </FormControl>
                    <Button type="submit" value="Login" bg="blue.500" color="white" _hover={{ bg: "blue.600" }} cursor="pointer" w="100%">Sign In</Button>
                </form>
                <Box mt={4} fontSize="sm" textAlign="center" display="flex" justifyContent="center" gap="5px" alignItems="center">
                    <Text color="gray.500" m="0px">Don&apos;t have an account?</Text>
                    <Link className="reg_link" to="/register">Sign Up</Link>
                </Box>
            </Box>
        </Container >
    )
}
