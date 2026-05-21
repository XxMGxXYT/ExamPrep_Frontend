import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Container, Heading, Text, VStack, Box, RadioGroup, Radio, Stack, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import StartScreen from "../components/StartScreen";
import Axios from "../api/Axios";

export default function ExamPage() {
    const toast = useToast()
    const { exams, user, reload } = useAuth()
    const { id } = useParams()
    const exam = exams.find((exam) => exam._id === id)
    // Get the exam's result id
    // const examResult = examsResults.find((result) => result.examId === id)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        userOptions: [], // This will hold the user's selected options for each question
        examStatus: false, // This will indicate whether the exam has been submitted or not
        userId: user.userId
    })

    if (!exam) {
        return (
            <Container my="2rem" maxW="container.lg" p={4} textAlign="center">
                <VStack spacing={4} align="center" textAlign="center" >
                    <Heading as="h1" fontWeight="bold">Exam Not Found</Heading>
                    <Text as="p" fontSize="20px" color="gray.400">The exam you are looking for does not exist.</Text>
                </VStack>
            </Container>
        )
    }

    const examQuestions = exam.questions.map((question, index) => (
        <Box key={index} mb="1rem" textAlign="left" p="1rem" bg="gray.50" borderRadius="8px">
            <Text fontSize="18px" fontWeight="bold">{index + 1}. {question.questionText}</Text>
            <RadioGroup name={`question-${index + 1}`} mt="0.5rem">
                <Stack direction="column">
                    {question.answers.map((option, optionIndex) => (
                        <Radio size="lg" colorScheme="blue" backgroundColor="gray.100" key={optionIndex} value={option}>
                            {option}
                        </Radio>
                    ))}
                </Stack>
            </RadioGroup>
        </Box>
    ))

    // Mapping on the RadioGroup's onChange event to store only the index of the selected option for each question in the formData.userOptions array
    const handleChange = (e) => {
        const { name } = e.target
        const radioButtons = document.querySelectorAll(`input[name="${name}"]`)
        const selectedIndex = Array.from(radioButtons).findIndex(radio => radio.checked)
        setFormData((prevVal) => {
            const updatedUserOptions = [...prevVal.userOptions]
            const questionIndex = parseInt(name.split("-")[1]) - 1 // Extracting the question index from the name attribute
            updatedUserOptions[questionIndex] = selectedIndex // Storing the selected index for the corresponding question
            return {
                ...prevVal,
                userOptions: updatedUserOptions
            }
        })
    }

    const handleExamSubmit = async (e) => {
        e.preventDefault()
        // Check if all questions have been answered
        const allAnswered = exam.questions.every((question, index) => formData.userOptions[index] !== undefined)
        if (!allAnswered) {
            toast({
                title: "Not all questions answered",
                description: "Please answer all questions before submitting.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            return
        }
        try {
            const response = await Axios.post(`/validate-exam/${id}`, formData)
            if (response.data.success) {
                toast({
                    title: "Exam submitted successfully",
                    description: "Your exam has been submitted successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: "Error submitting exam",
                    description: response.data.message || "There was an error submitting your exam. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
            // Empty all inputs & Show the StartScreen component again after submission
            const radioButtons = document.querySelectorAll(`input[type="radio"]`)
            radioButtons.forEach(radio => radio.checked = false)
            setFormData((prevVal) => ({
                ...prevVal,
                userOptions: []
            }))
            // Navigate to the exam result page after submission
            reload()
            setTimeout(() => {
                navigate(`/exam-result/${id}`)
            }, 1000)
        } catch (err) {
            if (err.response.status === 400) {
                toast({
                    title: "Exam already submitted",
                    description: "You have already submitted this exam. You cannot submit it again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
                return
            }
            toast({
                title: "Error submitting exam",
                description: err.message || "There was an error submitting your exam. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
        // Here you would typically send the formData to your backend for processing
    }

    return (
        <Box position="relative" bg="gray.100">
            <StartScreen />
            <Container my="2rem" maxW="container.lg" p={4} textAlign="center">
                <VStack spacing={4} align="center" textAlign="center" >
                    <Heading as="h1" fontWeight="bold">{exam.subject}</Heading>
                    <Text as="p" fontSize="20px" color="gray.400">Delivered on {exam.dateAndTime}</Text>
                </VStack>
                <Box mt="2rem" p="1rem" bg="white" borderRadius="8px">
                    <form action="" onSubmit={handleExamSubmit} onChange={handleChange}>
                        {examQuestions}
                        <Button onClick={() => setFormData((prevVal) => ({ ...prevVal, examStatus: true }))} mt="1rem" colorScheme="blue" size="lg" type="submit">Submit Exam</Button>
                    </form>
                </Box>
            </Container>
        </Box>
    )
}
