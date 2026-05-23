import { SimpleGrid, Box, VStack, Img, Text, HStack, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react"
import AsideBar from "../components/AsideBar"
import { useState } from "react"
import { AtSignIcon, AttachmentIcon, DeleteIcon, EditIcon, EmailIcon, LockIcon, StarIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import axios from "../api/Axios";
import { useNavigate } from "react-router-dom";

// Get the user data and put them in their places [Done].
// Send the edit form data to the backend.
// Implement delete account functionality.

export default function User() {
    const { user, setUser, login, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(true);
    const [confDelete, setConfDelete] = useState(false)
    const toast = useToast();
    const navigate = useNavigate()
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    }
    const [clicked, setClicked] = useState(false);
    const [formData, setFormData] = useState({
        userId: user.userId,
        email: user.email,
        username: user.username,
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleDeleteUser = async () => {
        try {
            const response = await axios.delete("/user")
            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: response.data.message || "User information updated successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                navigate("/")
                logout();
            }
        } catch (err) {
            console.error(err.message)
            toast({
                title: "Error",
                description: "Internal server error!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form validation here (e.g., check if passwords match, validate email format, etc.)
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        } else if (formData.password && formData.password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        } else {
            // Send the form data to the backend to update the user information
            try {
                const response = await axios.put(`/user`, formData);
                toast({
                    title: "Success",
                    description: "User information updated successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                // Update the user context with the new information but keep the previous values in the user context that are not being updated in the form (e.g., userId, userRole, major, etc.)
                setUser((prevUser) => ({
                    ...prevUser,
                    email: formData.email,
                    username: formData.username
                }));
                login(response.data.accessToken)
                setClicked(false);
            } catch (error) {
                console.error("Error updating user:", error);
                toast({
                    title: "Error",
                    description: "An error occurred while updating your account. Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        setClicked(false);
    }

    return (
        <SimpleGrid position={{ base: "relative", md: "unset" }} columns={10} spacing={0} height="100vh">
            {clicked &&
                <Box position="fixed" top="0" left="0" width="100vw" height="100vh" bg="blackAlpha.600" zIndex="10000" display="flex" justifyContent="center" alignItems="center">
                    <VStack bg="white" p="6" borderRadius="md" spacing="4">
                        <Text fontSize="xl" fontWeight="bold">Edit Account</Text>
                        <form onSubmit={handleSubmit}>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input name="email" type="email" onChange={handleChange} value={formData.email} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Username</FormLabel>
                                <Input name="username" type="text" onChange={handleChange} value={formData.username} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input name="password" type="password" onChange={handleChange} value={formData.password} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Confirm Password</FormLabel>
                                <Input name="confirmPassword" type="password" onChange={handleChange} value={formData.confirmPassword} />
                            </FormControl>
                        </form>
                        <HStack spacing="4">
                            <Box as="button" bg="blue.500" color="white" py="10px" px="15px" borderRadius="md" _hover={{ bg: "blue.600" }} onClick={handleSubmit}>
                                Save
                            </Box>
                            <Box as="button" bg="gray.500" color="white" py="10px" px="15px" borderRadius="md" _hover={{ bg: "gray.600" }} onClick={() => setClicked(false)}>
                                Cancel
                            </Box>
                        </HStack>
                    </VStack>
                </Box>
            }
            {confDelete &&
                <Box position="fixed" top="0" left="0" width="100vw" height="100vh" bg="blackAlpha.600" zIndex="10000" display="flex" justifyContent="center" alignItems="center">
                    <VStack bg="white" p="6" borderRadius="md" spacing="4">
                        <Text fontSize="xl" colorScheme="red" fontWeight="bold">Are you sure you want to delete your account?</Text>
                        <HStack spacing="4">
                            <Box as="button" bg="red.500" color="white" py="10px" px="15px" borderRadius="md" _hover={{ bg: "red.600" }} onClick={handleDeleteUser}>
                                Delete
                            </Box>
                            <Box as="button" bg="gray.500" color="white" py="10px" px="15px" borderRadius="md" _hover={{ bg: "gray.600" }} onClick={() => setConfDelete(false)}>
                                Cancel
                            </Box>
                        </HStack>
                    </VStack>
                </Box>
            }
            <Box position={{ base: "absolute", md: "unset" }} transition="0.3s" width="100%" style={collapsed ? { left: "-100%" } : { left: "0" }} left={{ base: "-100%", md: "0" }} gridColumn={{ base: "span 10", md: "span 3" }} bg="gray.50" borderRight="1px solid" borderColor="gray.200">
                <AsideBar toggleCollapse={toggleCollapse} collapsed={collapsed} />
            </Box>
            <Box gridColumn={{ base: "span 10", md: "span 7" }} p="6">
                <VStack bg="whiteAlpha.600" p="4" spacing="5">
                    <HStack spacing="4" w="100%" align="start">
                        <Img src={"/public/person1.png"} alt="User Avatar" boxSize="100px" borderRadius="50%" objectFit="cover" />
                        <VStack mt="15px" spacing="1" align="start">
                            <Text mb="0" fontSize="2xl" fontWeight="bold">{user.username}</Text>
                            <Text mb="0" fontSize="md" color="gray.500">{user.userRole}</Text>
                        </VStack>
                    </HStack>
                    <VStack spacing="4" w="100%" align="stretch" fontSize={{ base: "sm", md: "1.2rem" }}>
                        <HStack color="gray.600" spacing="2" w="100%" border="1px solid" borderColor="gray.200" p="4" borderRadius="md">
                            <EmailIcon />
                            <Text mb="0">Email:</Text>
                            <Text mb="0">{user.email}</Text>
                        </HStack>
                        <HStack color="gray.600" spacing="2" w="100%" border="1px solid" borderColor="gray.200" p="4" borderRadius="md">
                            <AtSignIcon />
                            <Text mb="0">Username:</Text>
                            <Text mb="0">{user.username}</Text>
                        </HStack>
                        <HStack color="gray.600" spacing="2" w="100%" border="1px solid" borderColor="gray.200" p="4" borderRadius="md">
                            <AttachmentIcon />
                            <Text mb="0">Major:</Text>
                            <Text mb="0">{user.major || "Not specified"}</Text>
                        </HStack>
                        <HStack color="gray.600" spacing="2" w="100%" border="1px solid" borderColor="gray.200" p="4" borderRadius="md">
                            <StarIcon />
                            <Text mb="0">Role:</Text>
                            <Text mb="0">{user.userRole}</Text>
                        </HStack>
                        <HStack color="gray.600" spacing="2" w="100%" border="1px solid" borderColor="gray.200" p="4" borderRadius="md">
                            <LockIcon />
                            <Text mb="0">Password:</Text>
                            <Text mb="0">*********</Text>
                        </HStack>
                    </VStack>
                    <HStack spacing="4" w="100%" justify="flex-end">
                        <Box aria-label="Edit account" as="button" bg="blue.500" color="white" py="10px" px="15px" borderRadius="md" _hover={{ bg: "blue.600" }} onClick={() => setClicked(!clicked)}>
                            <EditIcon />
                        </Box>
                        <Box aria-label="Delete account" as="button" bg="red.500" color="white" py="10px" px="15px" borderRadius="md" _hover={{ bg: "red.600" }} onClick={() => setConfDelete(true)}>
                            <DeleteIcon />
                        </Box>
                    </HStack>
                </VStack>
            </Box>
        </SimpleGrid>
    )
}

{/* <SimpleGrid position={{ base: "relative", md: "unset" }} columns={10} spacing={0} height="100vh">
            <Box position={{ base: "absolute", md: "unset" }} transition="0.3s" width="100%" style={collapsed ? { left: "-100%" } : { left: "0" }} left={{ base: "-100%", md: "0" }} gridColumn={{ base: "span 10", md: "span 3" }} bg="gray.50" borderRight="1px solid" borderColor="gray.200">
                <AsideBar toggleCollapse={toggleCollapse} collapsed={collapsed} />
            </Box>
            <Box gridColumn={{ base: "span 10", md: "span 7" }} p="6">
                User Content Area
            </Box>
        </SimpleGrid> */}
