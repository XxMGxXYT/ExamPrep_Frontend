import { Box, Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

export default function ExamResult() {

    const { examsResults, user, exams } = useAuth()
    const { id } = useParams()
    const exam = exams.find((exam) => exam._id === id)

    const examResult = examsResults.find((result) => result.examId === id && result.studentId === user.userId)

    // TODO: Make this design responsive [Done]

    return (
        <Container maxW="container.lg" mt={4}>
            <Box bg="white" p={4} borderRadius="md" boxShadow="md">
                <Heading size="lg" mb={4}>{exam.subject}</Heading>
                <HStack w="100%" spacing={8} justifyContent="space-between" alignItems="center" flexWrap={{ base: "wrap", md: "nowrap" }}>
                    <VStack alignItems={{ base: "center", md: "start" }} w={{ base: "100%", md: "50%" }}>
                        <Text m="0" width="fit-content">Performance Summary</Text>
                        <Heading size="lg">{examResult.score}%</Heading>
                        <HStack color="green.500" p="5px 10px" borderRadius="md" bg="green.50">
                            <Text m="0" width="fit-content">Pass</Text>
                            <StarIcon color="yellow.500" />
                        </HStack>
                    </VStack>
                    <VStack w={{ base: "100%", md: "50%" }} p={4} bg="gray.50" borderRadius="md" alignItems={{ base: "center", md: "flex-start" }}>
                        <VStack alignItems="flex-start" w={{ base: "fit-content", md: "100%" }}>
                            <Text m="0" width="fit-content">Student Name</Text>
                            <Heading size="md">{user.username}</Heading>
                        </VStack>
                        <HStack w="100%" spacing={{ base: 4, md: 8 }} justifyContent={{ base: "center", md: "flex-start" }} flexWrap="wrap">
                            <VStack>
                                <Text m="0" width="fit-content">Exam ID</Text>
                                <Heading size="md">{examResult.examId}</Heading>
                            </VStack>
                            <VStack>
                                <Text m="0" width="fit-content">Date</Text>
                                <Heading size="md">{examResult.dateTaken}</Heading>
                            </VStack>
                        </HStack>
                    </VStack>
                </HStack>
            </Box>
        </Container>
    )
}
