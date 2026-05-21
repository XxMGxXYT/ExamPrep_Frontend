/* eslint-disable react/prop-types */
import { Box, HStack, Img, Text, VStack } from "@chakra-ui/react";
// Import icons from chakra ui icons
import { SettingsIcon, ArrowRightIcon, AtSignIcon, AttachmentIcon, AddIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function AsideBar({ toggleCollapse, collapsed }) {

    const { user, logout } = useAuth()

    const itemHoverStyle = {
        bg: "blue.100",
        cursor: "pointer"
    };
    return (
        <Box position="relative" zIndex="10">
            <Box display={{ base: "block", md: "none" }} position="absolute" style={collapsed ? { transform: "rotate(0deg)" } : { transform: "rotate(180deg) translateX(31px)" }} left="100%" top="370px" transform="translateY(-50%)" zIndex="10" bg="white" borderRadius="md" boxShadow="md" p="2">
                <ArrowRightIcon cursor="pointer" onClick={() => toggleCollapse()} />
            </Box>
            <Box position="absolute" as="aside" width="100%" bg="gray.100" p="4" borderRadius="md" boxShadow="md" height={{ base: "200vh", md: "100vh" }}>
                <VStack spacing="4" align="stretch" mt="10px">
                    <Box mb="4">
                        <HStack spacing="3" align="center">
                            <Img src={"/person1.png"} alt="User Avatar" boxSize="50px" borderRadius="50%" objectFit="cover" />
                            <Text display="flex" mb="0" justifyContent="center" alignItems="center" fontSize="lg" fontWeight="bold">{user.username}</Text>
                        </HStack>
                    </Box>
                    <Box bg="white" p="4" borderRadius="md" boxShadow="sm" _hover={itemHoverStyle}>
                        <Link to="/user/profile">
                            <HStack spacing="2" align="center">
                                <AtSignIcon />
                                <Text mb="0">Profile</Text>
                            </HStack>
                        </Link>
                    </Box>
                    {user.userRole === "instructor" &&
                        <Box bg="white" p="4" borderRadius="md" boxShadow="sm" _hover={itemHoverStyle}>
                            <Link to="/user/create-exam">
                                <HStack spacing="2" align="center">
                                    <AddIcon />
                                    <Text mb="0">Create exam</Text>
                                </HStack>
                            </Link>
                        </Box>
                    }
                    <Box bg="white" p="4" borderRadius="md" boxShadow="sm" _hover={itemHoverStyle}>
                        <Link to="/user/exams">
                            <HStack spacing="2" align="center">
                                <AttachmentIcon />
                                <Text mb="0">Exams</Text>
                            </HStack>
                        </Link>
                    </Box>
                    <Box bg="white" p="4" borderRadius="md" boxShadow="sm" _hover={itemHoverStyle}>
                        <Link to="/user/dashboard">
                            <HStack spacing="2" align="center">
                                <SettingsIcon />
                                <Text mb="0">Dashboard</Text>
                            </HStack>
                        </Link>
                    </Box>
                    {/* {user.userRole.toLowerCase() === "teacher" &&
                        <Box bg="white" p="4" borderRadius="md" boxShadow="sm" _hover={itemHoverStyle}>
                            <Link to="/user/create-exam">
                                <HStack spacing="2" align="center">
                                    <PlusSquareIcon />
                                    <Text mb="0">Create exam</Text>
                                </HStack>
                            </Link>
                        </Box>
                    } */}
                    <HStack bg="white" p="4" borderRadius="md" boxShadow="sm" cursor="pointer" _hover={{ bg: "red.100" }} onClick={logout}>
                        <ExternalLinkIcon />
                        <Text mb="0">Logout</Text>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    )
}
