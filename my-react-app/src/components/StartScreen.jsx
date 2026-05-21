import { Box, Heading, Text, Button } from "@chakra-ui/react"
import { useState } from "react"

export default function StartScreen() {
    const [examStarted, setExamStarted] = useState(false)

    const handleStartExam = () => {
        setExamStarted(true)
    }

    if (examStarted) {
        return null
    }

    return (
        <Box position="fixed" top="0" left="0" right="0" bottom="0" bg="white" zIndex="10" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Heading as="h1" textAlign="center" fontSize={{ base: "28px", "md": "40px" }} fontWeight="bold">Welcome to the Exam App</Heading>
            <Text as="p" fontSize="20px" color="gray.400">Click the button below to start the exam.</Text>
            <Button mt="1rem" colorScheme="blue" size="lg" onClick={handleStartExam}>
                Start Exam
            </Button>
        </Box>
    )
}
