/* eslint-disable react/prop-types */
import { HStack, Box, Image, VStack, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Card({ exam, isTaken }) {

    let src = "/pic2.jpg"
    if (exam.subject === "Math") {
        src = "/pic2.jpg"
    } else if (exam.subject === "Quantum physics") {
        src = "/pic4.jpg"
    } else if (exam.subject === "Linear Algebra") {
        src = "/pic3.jpg"
    } else if (exam.subject === "Artificail Inteligance") {
        src = "/pic1.jpg"
    } else if (exam.subject === "Cyber Security") {
        src = "/pic1.jpg"
    } else if (exam.subject === "Basics math") {
        src = "/pic2.jpg"
    }

    return (
        <HStack flexWrap="wrap" justify="space-between" spacing={2} mt="1rem" p="1rem 1.5rem" bg="white" borderRadius="8px" w="100%" _hover={{ boxShadow: "md" }} >
            <Box display="flex" alignItems="center" justifyContent={{ base: "center", md: "start" }} gap="2rem" w={{ base: "100%", md: "auto" }}>
                <Image w="150px" borderRadius="10px" src={src} />
                <VStack align="start">
                    <Text fontWeight="bold" fontSize="1.5rem" m="0px" textAlign={{ base: "center", md: "start" }}>{exam.subject}</Text>
                    <Text color="gray.600" fontSize="1rem" textAlign="start">Delivered on {exam.dateAndTime}</Text>
                    <Text color="gray.600" fontSize="1rem" textAlign="start">Created by: {exam.instructor}</Text>
                </VStack>
            </Box>
            <Box w={{ base: "100%", md: "auto" }}>
                {isTaken ? (
                    <Button as={Link} to={`/exam-result/${exam._id}`} colorScheme="green" w="100%">View Result</Button>
                ) : (
                    <Button as={Link} to={`/exam/${exam._id}`} colorScheme="blue" w="100%">Take Exam</Button>
                )}
            </Box>
        </HStack>
    )
}
