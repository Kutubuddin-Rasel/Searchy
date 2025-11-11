import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Header(){
    const navigate = useNavigate();
    const handleLogut = async()=>{
        try {
            const response = await axios.post("/api/v1/users/logout")
            console.log("Server response data on logut: ",response.data)
            navigate("/sign-in",{replace:true})
        } catch (error) {
            console.error(error)
        }
    }
    return(
        <div className="flex w-full p-4 bg-gray-300 justify-around">
            <h2>User Name</h2>
            <button onClick={handleLogut} className="bg-blue-600 text-white py-2 px-2 rounded-2xl hover:bg-blue-700 transition disabled:opacity-60">
                logout
            </button>
        </div>
    );
}