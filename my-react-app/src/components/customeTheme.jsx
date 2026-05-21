import { extendTheme } from "@chakra-ui/react";
import { color } from "framer-motion";

const customTheme = extendTheme({
    styles: {
        global: {
            body: {
                color: "#000",
                bg: "#f0f0f0"
            }
        }
    }
});

export default customTheme;