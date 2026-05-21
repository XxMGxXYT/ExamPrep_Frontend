import { Box, Img, List, ListItem } from '@chakra-ui/react'
import { StarIcon } from "@chakra-ui/icons"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {

    const { isAuthenticated } = useAuth()

    // Refresh the page once the user logs in, to update the navbar links and show the user avatar instead of the login and register links.


    // Dark Mode Toggle can be added later

    const underline = {
        content: '""',
        position: "absolute",
        width: "0%",
        bg: "blue.500",
        height: "3px",
        bottom: "-2px",
        left: "0",
        transition: "0.3s"
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <Box className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <StarIcon boxSize={5} color="blue.400" className="me-2" />
                    <span className="fw-bold text-primary fs-3">ExamPrep</span>
                    <StarIcon boxSize={5} color="blue.400" className="ms-2" />
                </Link>
                <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Box className="collapse navbar-collapse" id="navbarNav">
                    <List gap="20px" className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <Link className="fw-semibold" to="/">
                            <ListItem mt={{ base: "10px", lg: "0px" }} d={{ base: "block", md: "flex" }} alignItems={{ base: "unset", md: "center" }} height="30px" position="relative" cursor="pointer" _after={underline} transition="0.3s" _hover={{ color: "blue.500", _after: { width: "100%" } }} className="nav-item">Home</ListItem>
                        </Link>
                        <Link className="fw-semibold" to="/about">
                            <ListItem height="30px" position="relative" d={{ base: "block", md: "flex" }} alignItems={{ base: "unset", md: "center" }} cursor="pointer" _after={underline} transition="0.3s" _hover={{ color: "blue.500", _after: { width: "100%" } }} className="nav-item">About</ListItem>
                        </Link>
                        {isAuthenticated ?
                            <Link className="fw-semibold" to="/user">
                                <ListItem cursor="pointer" w="40px" className="nav-item">
                                    <Img src={"/person1.png"} alt="User Avatar" boxSize="40px" borderRadius="50%" m="4px" objectFit="cover" />
                                </ListItem>
                            </Link>
                            :
                            <>
                                <Link className="fw-semibold" to="/login">
                                    <ListItem height="30px" position="relative" cursor="pointer" _after={underline} transition="0.3s" _hover={{ color: "blue.500", _after: { width: "100%" } }} className="nav-item">Login</ListItem>
                                </Link>
                                <Link className="fw-semibold" to="/register">
                                    <ListItem height="30px" position="relative" cursor="pointer" _after={underline} transition="0.3s" _hover={{ color: "blue.500", _after: { width: "100%" } }} className="nav-item">Register</ListItem>
                                </Link>
                            </>
                        }
                    </List>
                </Box>
            </Box>
        </nav >
    )
}
