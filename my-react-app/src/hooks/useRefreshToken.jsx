import axios from "../api/Axios";

const useRefreshToken = async () => {
    try {
        await axios.get("/refresh-token")
    } catch (err) {
        console.error(err.message)
    }
}

export default useRefreshToken;