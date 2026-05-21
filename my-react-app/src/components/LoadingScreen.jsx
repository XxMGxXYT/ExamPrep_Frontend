import { Box, Spinner } from "@chakra-ui/react"

export default function LoadingScreen() {
    return (
        <Box className="loading" width="100%" position="fixed" zIndex="1000">
            <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex="1000" />
        </Box>
    )
}
