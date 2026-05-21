import { createRoot } from "react-dom/client"
import App from "./App"
import { ChakraProvider } from "@chakra-ui/react"
import { BrowserRouter as Router } from "react-router-dom"
import customeTheme from "./components/customeTheme"
import { AuthProvider } from "./context/AuthContext"
const root = createRoot(document.getElementById("root"))

root.render(
  <ChakraProvider theme={customeTheme}>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </ChakraProvider>
)