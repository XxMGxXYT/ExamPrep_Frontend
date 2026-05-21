import { Container, Heading, HStack, VStack, Text, CardBody, Divider, Badge, CardHeader, Box, Card, CardFooter } from "@chakra-ui/react";
import SearchBar from "../components/SearchBar";
import CardComp from "../components/CardComp";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { keyframes } from "@emotion/react";

export default function Home() {

    const { exams, checkExamStatus, user, teachersDashBoard } = useAuth();

    console.log(teachersDashBoard)

    const [search, setSearch] = useState("");
    const [show, setShow] = useState(true);

    const cards = exams.map((exam) => (
        <CardComp key={exam._id} exam={exam} isTaken={checkExamStatus(exam._id)} />
    )).filter((card) => card.props.exam.subject.toLowerCase().includes(search.toLowerCase()) || card.props.exam.dateAndTime.toLowerCase().includes(search.toLowerCase()));

    const teacherExams = exams.filter((exam) => {
        if (user) {
            if (exam.createdBy === user.userId) {
                return exam
            }
        }
    })

    // Number of students for this instructor's exams

    const fadeSlideIn = keyframes`
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }`;

    const instructorCard = () => {
        return teacherExams.map((exam) => {
            return (
                <Box key={exam._id}>
                    <Card
                        mb="4"
                        borderRadius="2xl"
                        overflow="hidden"
                        border="1px solid"
                        borderColor="purple.100"
                        boxShadow="0 4px 24px rgba(107, 70, 193, 0.06)"
                        bg="white"
                        position="relative"
                        animation={`${fadeSlideIn} 0.45s cubic-bezier(.22,1,.36,1) both`}
                        transition="box-shadow 0.25s, transform 0.25s"
                        _hover={{
                            boxShadow: "0 8px 36px rgba(107, 70, 193, 0.12)",
                            transform: "translateY(-3px)",
                        }}
                    >
                        {/* Accent bar البنفسجي ل لوحة تحكم المعلم */}
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            h="4px"
                            bgGradient="linear(to-r, purple.400, indigo.500)"
                        />

                        <CardHeader pt={6} pb={2}>
                            <VStack align="start" spacing={1}>
                                {/* عرض معرف الاختبار كـ Badge */}
                                <Badge
                                    colorScheme="purple"
                                    variant="subtle"
                                    borderRadius="md"
                                    px={2}
                                    fontSize="xs"
                                    fontWeight="700"
                                >
                                    {exam._id}
                                </Badge>
                                <Text
                                    fontWeight="700"
                                    fontSize="xl"
                                    color="gray.800"
                                    letterSpacing="-0.4px"
                                    fontFamily="Georgia, serif"
                                    mt={1}
                                >
                                    {exam.subject}
                                </Text>
                            </VStack>
                        </CardHeader>

                        <Divider borderColor="gray.100" mx={5} width="auto" />

                        <CardBody py={3}>
                            <VStack align="start" spacing={3}>
                                {/* اسم المعلم */}
                                <HStack spacing={2}>
                                    <Text fontSize="sm" color="gray.400" fontWeight="500">
                                        Instructor:
                                    </Text>
                                    <Text fontSize="sm" color="gray.700" fontWeight="600">
                                        {exam.instructor}
                                    </Text>
                                </HStack>

                                {/* تاريخ ووقت الاختبار */}
                                <HStack spacing={2}>
                                    <Text fontSize="sm" color="gray.400" fontWeight="500">
                                        Schedule:
                                    </Text>
                                    <Text fontSize="sm" color="gray.700" fontWeight="600">
                                        {exam.dateAndTime}
                                    </Text>
                                </HStack>
                            </VStack>
                        </CardBody>
                        <CardFooter pt={2} pb={4} justifyContent="flex-end">
                            <Text>Students submitted: {teachersDashBoard.studentsCount} </Text>
                            <Text></Text>
                        </CardFooter>
                    </Card>
                </Box>
            )
        });
    }

    return (
        <Container my="2rem" maxW="container.lg" p={4} textAlign="center">
            <VStack spacing={4} align="center" textAlign="center" >
                <Heading as="h1" fontWeight="bold">Welcome to ExamPrep!</Heading>
                <Text as="p" fontSize="20px" color="gray.400">Find, start, and review your exams all in one place.</Text>
            </VStack>
            <SearchBar search={search} setSearch={setSearch} setShow={setShow} />
            {show &&
                <HStack justify="space-between" mt="2rem" textAlign="center" >
                    <Text as="h3" fontWeight="bold">Recently added exams.</Text>
                    <Text as="span" color="blue.500" cursor="pointer" _hover={{ color: "blue.600" }}>View all</Text>
                </HStack>
            }
            {((user && user.userRole === "student") || !user) &&
                <VStack spacing={4} align="center" textAlign="center" mt="2rem">
                    <Text as="h3" fontWeight="bold">All Exams</Text>
                    {cards}
                </VStack>
            }
            {user && user.userRole === "instructor" && (
                <VStack>
                    <Text as="h3" fontWeight="bold">Your assisments</Text>
                    <Box w="100%">
                        {instructorCard()}
                    </Box>
                </VStack>
            )}
            {(user || !user) && exams.length === 0 && (
                <VStack spacing={4} align="center" textAlign="center" mt="2rem">
                    <Text as="h3" fontWeight="bold">No exams available</Text>
                    <Text as="p" color="gray.400">Please check back later.</Text>
                </VStack>
            )}
        </Container>
    )
}
