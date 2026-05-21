import { Box, SimpleGrid, VStack, Card, CardHeader, CardBody, CardFooter, HStack, Button, Badge, Text, Divider, useToast, } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import AsideBar from "../components/AsideBar";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "../api/Axios"

export default function Exams() {

    const toast = useToast()
    const { checkExamStatus, exams, user, reload } = useAuth();
    const teacherExams = exams.filter((exam) => exam.createdBy === user.userId)
    console.log(teacherExams)
    console.log(exams)

    const [collapsed, setCollapsed] = useState(true);
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    }

    const handleDeleteSubmit = async (id) => {
        // const id = e.target.parentNode.parentNode.childNodes[1].children.item(0).children.item(0).innerHTML
        console.log(id)

        try {
            const response = await axios.delete(`/create-exam/${id}`)
            if (response.status === 200) {
                toast({
                    title: "Exam deleted Successful",
                    description: response.data.message || "Exam has been deleted Successful.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                })
                reload()
            }
        } catch (err) {
            toast({
                title: "Deleting exam faild",
                description: "Something went wrong!.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
        }
        // document.parentNode.children
    }

    const fadeSlideIn = keyframes`
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }`;

    const shimmer = keyframes`
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }`;

    const renderExams = () => {
        return exams.map((exam) => {
            const isTaken = checkExamStatus(exam._id);
            return (
                <Card
                    key={exam._id}
                    mb="4"
                    borderRadius="2xl"
                    overflow="hidden"
                    border="1px solid"
                    borderColor={isTaken ? "blue.100" : "green.100"}
                    boxShadow={
                        isTaken
                            ? "0 4px 24px rgba(66,153,225,0.10)"
                            : "0 4px 24px rgba(72,187,120,0.10)"
                    }
                    bg="white"
                    position="relative"
                    animation={`${fadeSlideIn} 0.45s cubic-bezier(.22,1,.36,1) both`}
                    transition="box-shadow 0.25s, transform 0.25s"
                    _hover={{
                        boxShadow: isTaken
                            ? "0 8px 36px rgba(66,153,225,0.18)"
                            : "0 8px 36px rgba(72,187,120,0.18)",
                        transform: "translateY(-3px)",
                    }}
                >
                    {/* Accent bar */}
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        h="4px"
                        bgGradient={
                            isTaken
                                ? "linear(to-r, blue.300, blue.500)"
                                : "linear(to-r, green.300, green.500)"
                        }
                        sx={{
                            backgroundSize: "200% auto",
                            animation: `${shimmer} 2.5s linear infinite`,
                        }}
                    />

                    <CardHeader pt={6} pb={2}>
                        <HStack justifyContent="space-between" align="center">
                            <Text
                                fontWeight="700"
                                fontSize="lg"
                                color="gray.800"
                                letterSpacing="-0.3px"
                                fontFamily="Georgia, serif"
                            >
                                {exam.subject}
                            </Text>
                            <Badge
                                colorScheme={isTaken ? "blue" : "green"}
                                borderRadius="full"
                                px={3}
                                py={1}
                                fontSize="xs"
                                fontWeight="600"
                                letterSpacing="0.5px"
                                textTransform="uppercase"
                                boxShadow={
                                    isTaken
                                        ? "0 0 0 2px rgba(66,153,225,0.15)"
                                        : "0 0 0 2px rgba(72,187,120,0.15)"
                                }
                            >
                                {isTaken ? "✓ Taken" : "Pending"}
                            </Badge>
                        </HStack>
                    </CardHeader>

                    <Divider borderColor="gray.100" mx={5} width="auto" />

                    <CardBody py={3}>
                        <HStack spacing={2}>
                            <Text fontSize="sm" color="gray.400" fontWeight="500">
                                Instructor
                            </Text>
                            <Text fontSize="sm" color="gray.600" fontWeight="600">
                                {exam.instructor}
                            </Text>
                        </HStack>
                    </CardBody>

                    <CardFooter pt={1} pb={4}>
                        <Button as={Link} to={`/exam-result/${exam._id}`}
                            colorScheme={isTaken ? "blue" : "green"}
                            borderRadius="xl"
                            size="sm"
                            fontWeight="600"
                            letterSpacing="0.3px"
                            px={5}
                            boxShadow={
                                isTaken
                                    ? "0 2px 10px rgba(66,153,225,0.25)"
                                    : "0 2px 10px rgba(72,187,120,0.25)"
                            }
                            transition="all 0.2s"
                            _hover={{
                                transform: "scale(1.04)",
                                boxShadow: isTaken
                                    ? "0 4px 16px rgba(66,153,225,0.35)"
                                    : "0 4px 16px rgba(72,187,120,0.35)",
                            }}
                            _active={{ transform: "scale(0.97)" }}
                        >
                            {isTaken ? "View Result" : "Take Exam"}
                        </Button>
                    </CardFooter>
                </Card>
            );
        })
    }

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
                            {/* زر الحذف الأحمر الثابت */}
                            <Button
                                onClick={() => handleDeleteSubmit(exam._id)}
                                colorScheme="red"
                                variant="solid"
                                borderRadius="xl"
                                size="sm"
                                fontWeight="600"
                                px={5}
                                boxShadow="0 2px 10px rgba(229, 62, 62, 0.2)"
                                transition="all 0.2s"
                                _hover={{
                                    transform: "scale(1.04)",
                                    boxShadow: "0 4px 16px rgba(229, 62, 62, 0.35)",
                                }}
                                _active={{ transform: "scale(0.97)" }}
                            >
                                Delete Exam
                            </Button>
                        </CardFooter>
                    </Card>
                </Box>
            )
        });
    }


    return (
        <SimpleGrid position={{ base: "relative", md: "unset" }} columns={10} spacing={0} height="100vh">
            <Box position={{ base: "absolute", md: "unset" }} transition="0.3s" width="100%" style={collapsed ? { left: "-100%" } : { left: "0" }} left={{ base: "-100%", md: "0" }} gridColumn={{ base: "span 10", md: "span 3" }} bg="gray.50" borderRight="1px solid" borderColor="gray.200">
                <AsideBar toggleCollapse={toggleCollapse} collapsed={collapsed} />
            </Box>
            <Box gridColumn={{ base: "span 10", md: "span 7" }} p="6">
                {user.userRole === "student" &&
                    <VStack alignItems="stretch">
                        <Box fontSize="2xl" fontWeight="bold" mb="4">Exams</Box>
                        {renderExams()}
                    </VStack>
                }
                {user.userRole === "instructor" &&
                    <Box>
                        {instructorCard()}
                    </Box>
                }
            </Box>
        </SimpleGrid>
    )
}
