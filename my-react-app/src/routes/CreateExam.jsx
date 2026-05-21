import { Box, Select, Radio, RadioGroup, SimpleGrid, Text, Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import AsideBar from "../components/AsideBar";
import { useRef, useState } from "react";
import Axios from "../api/Axios";
import { useAuth } from "../context/AuthContext";

export default function CreateExam() {

    const [collapsed, setCollapsed] = useState(true);
    const { user } = useAuth();
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    }
    const toast = useToast();
    const [examDivStatus, setExamDivStatus] = useState(false);
    const [questionsDivsElements, setQuestionsDivsElements] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [questionsState, setQuestionsState] = useState([])
    const [questionsData, setQuestionsData] = useState([]);
    const [toggleConfirmation, setToggleConfirmation] = useState(false);
    const questionsDivs = [];
    const ref = useRef(null);

    const [examsOptions, setExamOptions] = useState({
        subject: "Other",
        questions: 5,
        answers: 4
    });

    const handleExamOptions = (e) => {
        const { name, value } = e.target
        setExamOptions((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFinalExam = (e) => {
        const { value } = e.target
        setQuestionsState((prev) => ([
            ...prev,
            { index: value }
        ]))
    }

    const handleExam = () => {
        setExamDivStatus(true)
        for (let i = 0; i < examsOptions.questions; i++) {
            questionsDivs.push(i);
        }
        const questionsDivsElements = questionsDivs.map((ind) => {
            return (
                <Box className="questions" key={ind} mb="6" p="4" border="1px solid" borderColor="gray.200" borderRadius="md">
                    <Text fontSize="1.25rem" fontWeight="bold" mb="4">Question {ind + 1}</Text>
                    <FormControl isRequired>
                        <FormLabel>Question Text</FormLabel>
                        <Input name="questionText" onChange={handleFinalExam} placeholder={`Enter question ${ind + 1} text`} my="4" />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Answers</FormLabel>
                        <SimpleGrid columns={2} spacing={4}>
                            {[...Array(Number(examsOptions.answers))].map((_, ansIndex) => (
                                <Box key={ansIndex}>
                                    <Input placeholder={`Answer ${ansIndex + 1} text`} my="2" />
                                </Box>
                            ))}
                        </SimpleGrid>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Correct Answer</FormLabel>
                        <Select placeholder="Select correct answer" my="4">
                            {[...Array(Number(examsOptions.answers))].map((_, ansIndex) => (
                                <Box as="option" key={ansIndex} value={ansIndex + 1}>Answer {ansIndex + 1}</Box>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )
        })
        setQuestionsDivsElements(questionsDivsElements);
    }

    const sendData = async () => {
        // Logic to send questionsData to the backend goes here
        try {
            // Check if there is any question with empty fields before sending data
            if (questionsData.some(q => !q.questionText || !q.answers || !q.correctAnswer)) {
                // Clean up the state after sending data
                setToggleConfirmation(false);
                setQuestionsData([]);
                toast({
                    title: "Error",
                    description: "Each question must have question text, answers, and a correct answer selected.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
            const response = await Axios.post("/create-exam", { questions: questionsData, subject: examsOptions.subject, createdBy: user.userId });
            if (response.data.success) {
                toast({
                    title: "Success",
                    description: "Exam created successfully!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                // Reload the page so the created exam appears in the dashboard without needing to navigate away and back to the dashboard
                window.location.reload();
            } else {
                // Clean up the state after sending data
                setToggleConfirmation(false);
                setQuestionsData([]);
                toast({
                    title: "Error",
                    description: "There was an error creating the exam. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
            // Clean up the state after sending data
            setToggleConfirmation(false);
            setQuestionsData([]);
            // Clean up the form inputs
            ref.current.childNodes.forEach((questionNode) => {
                if (questionNode.classList.contains("create")) return;
                questionNode.querySelector('input[name="questionText"]').value = "";
                questionNode.querySelectorAll('input[placeholder^="Answer"]').forEach((answerInput) => {
                    answerInput.value = "";
                });
                const correctAnswerSelect = questionNode.querySelector('select');
                correctAnswerSelect.selectedIndex = 0; // Reset to placeholder
            });
        } catch (error) {
            setToggleConfirmation(false);
            console.error("Error creating exam:", error);
            toast({
                title: "Error",
                description: "There was an error creating the exam:" + (error.response?.data?.message || error.message),
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const handleCancel = () => {
        setToggleConfirmation(false);
        setQuestionsData([]);
    }

    const handleCreateExam = () => {
        ref.current.childNodes.forEach((questionNode) => {
            // Make it skips the last node which is the create button
            if (questionNode.classList.contains("create")) return;
            const questionText = questionNode.querySelector('input[name="questionText"]').value;
            const answers = [];
            questionNode.querySelectorAll('input[placeholder^="Answer"]').forEach((answerInput) => {
                answers.push(answerInput.value);
            });
            const correctAnswerSelect = questionNode.querySelector('select');
            const correctAnswer = correctAnswerSelect.options[correctAnswerSelect.selectedIndex].value;
            // Add the question data to the questionsData state
            setQuestionsData((prev) => ([
                ...prev,
                { questionText, answers, correctAnswer }
            ]));
        })
        setToggleConfirmation(true);
        // Logic to create exam goes here
    }
    return (
        <SimpleGrid position={{ base: "relative", md: "unset" }} columns={10} spacing={0} height="100vh">
            <Box position={{ base: "absolute", md: "unset" }} transition="0.3s" width="100%" style={collapsed ? { left: "-100%" } : { left: "0" }} left={{ base: "-100%", md: "0" }} gridColumn={{ base: "span 10", md: "span 3" }} bg="gray.50" borderRight="1px solid" borderColor="gray.200">
                <AsideBar toggleCollapse={toggleCollapse} collapsed={collapsed} />
            </Box>
            {toggleConfirmation &&
                <Box position="fixed" zIndex="100" top="0" left="0" width="100%" height="100%" bg="rgba(0, 0, 0, 0.5)" display="flex" alignItems="center" justifyContent="center">
                    <Box bg="white" p="6" borderRadius="md" boxShadow="sm" textAlign="center">
                        <Text fontSize="1.25rem" fontWeight="bold" mb="4">Are you sure you want to create this exam?</Text>
                        <Button colorScheme="green" mr="4" onClick={sendData}>Yes</Button>
                        <Button colorScheme="red" onClick={handleCancel}>No</Button>
                    </Box>
                </Box>
            }
            <Box gridColumn={{ base: "span 10", md: "span 7" }} p="6">
                <Box width="100%" bg="white" p="6" borderRadius="md" boxShadow="sm">
                    <Box mb="30px">
                        <Text fontSize="1.5rem" fontWeight="bold" mb="1">Select exam subject</Text>
                        <Select bg="white" onChange={handleExamOptions} name="subject" cursor="pointer" mb={4} maxW="300px">
                            <Box as="option" defaultValue="Other">Other</Box>
                            <Box as="option" value="Computer Science">Computer Science</Box>
                            <Box as="option" value="Quantum physics">Quantum physics</Box>
                            <Box as="option" value="Artificail Inteligance">Artificail Inteligance</Box>
                            <Box as="option" value="Cyber Security">Cyber Security</Box>
                            <Box as="option" value="Linear Algebra">Linear Algebra</Box>
                            <Box as="option" value="Basics math">Basics math</Box>
                        </Select>
                    </Box>
                    <Box mb="30px">
                        <Text fontSize="1.5rem" fontWeight="bold" mb="1">Number of questions</Text>
                        <RadioGroup defaultValue="5">
                            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                                <Radio onChange={handleExamOptions} name="questions" value="5">5 Questions</Radio>
                                <Radio onChange={handleExamOptions} name="questions" value="10">10 Questions</Radio>
                                <Radio onChange={handleExamOptions} name="questions" value="15">15 Questions</Radio>
                                <Radio onChange={handleExamOptions} name="questions" value="20">20 Questions</Radio>
                            </SimpleGrid>
                        </RadioGroup>
                    </Box>
                    <Box mb="30px">
                        <Text fontSize="1.5rem" fontWeight="bold" mb="1">Number of answers (for each Q)</Text>
                        <RadioGroup defaultValue="4">
                            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                                <Radio onChange={handleExamOptions} name="answers" value="2">2 Answers</Radio>
                                <Radio onChange={handleExamOptions} name="answers" value="3">3 Answers</Radio>
                                <Radio onChange={handleExamOptions} name="answers" value="4">4 Answers</Radio>
                                <Radio onChange={handleExamOptions} name="answers" value="6">6 Answers</Radio>
                            </SimpleGrid>
                        </RadioGroup>
                    </Box>
                    <Box width="100%" textAlign="center" onClick={handleExam}>
                        <Button colorScheme="blue" mt="4">Create Exam</Button>
                    </Box>
                </Box>
                <Box mt="6" width="100%" bg="white" p="6" borderRadius="md" boxShadow="sm">
                    <form ref={ref} action="">
                        {examDivStatus && questionsDivsElements}
                        {examDivStatus &&
                            <Box className="create" width="100%" textAlign="center" onClick={handleCreateExam}>
                                <Button colorScheme="green" mt="4">Create</Button>
                            </Box>
                        }
                    </form>
                </Box>
            </Box>
        </SimpleGrid>
    )
}
