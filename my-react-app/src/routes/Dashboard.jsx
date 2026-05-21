import { Box, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import AsideBar from "../components/AsideBar";
import { useEffect, useState } from "react";
import axios from "../api/Axios"
import { useAuth } from "../context/AuthContext";
import AnalyticsChart from "../components/Chart";
import AnalyticsPieChart from "../components/PieChart"
import AnalyticsComposedChart from "../components/CompoCharts"

export default function Dashboard() {

    const { user, setTeachersDashBoard } = useAuth()

    const [collapsed, setCollapsed] = useState(true);
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("/dashboard", user)
                console.log(response.data)
                setTeachersDashBoard(response.data.data)
            } catch (err) {
                console.error(err.message)
            }
        }
        fetchData()
    }, [setTeachersDashBoard, user])

    return (
        <SimpleGrid position={{ base: "relative", md: "unset" }} columns={10} spacing={0} height="100vh">
            <Box position={{ base: "absolute", md: "unset" }} transition="0.3s" width="100%" style={collapsed ? { left: "-100%" } : { left: "0" }} left={{ base: "-100%", md: "0" }} gridColumn={{ base: "span 10", md: "span 3" }} bg="gray.50" borderRight="1px solid" borderColor="gray.200">
                <AsideBar toggleCollapse={toggleCollapse} collapsed={collapsed} />
            </Box>
            <Box gridColumn={{ base: "span 10", md: "span 7" }} p="6" py={8}>
                {user.userRole === "instructor" &&
                    <HStack gap={{ base: "40px", lg: "20px" }} flexWrap="wrap">
                        <Box w={{ base: "100%", lg: "calc((100% / 2) - 20px)" }}>
                            <AnalyticsPieChart />
                        </Box>
                        <Box w={{ base: "100%", lg: "calc((100% / 2) - 20px)" }}>
                            <AnalyticsChart />
                        </Box>
                        <Box w={{ base: "100%", lg: "calc((100% / 2) - 20px)" }}>
                            <AnalyticsComposedChart />
                        </Box>
                    </HStack>
                }
                {user.userRole === "student" &&
                    <Text>Students dashboard</Text>
                }
            </Box>
        </SimpleGrid>
    )
}
