import React,{useState,useContext} from 'react'
import {useNavigate} from "react-router-dom"
import Input from "../../components/Inputs/Input.jsx"
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector.jsx"
import { validateEmail } from "../../utils/helper.js"
import {API_PATHS} from "../../utils/apiPaths.js"
import axiosInstance from "../../utils/axiosInstance.js"
import {UserContext} from "../../context/userContext.jsx";
import uploadImage from "../../utils/uploadImage.js"

const SignUp = ({setCurrentPage}) => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName,setFullName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const [error,setError] = useState(null);

  const {updateUser} = useContext(UserContext);

  const navigate=useNavigate()

  const handleSignUp=async(e)=>{
    e.preventDefault();

    let profileImageUrl=""

    if(!fullName){
      setError("Please enter full name")
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email");
      return;
    }

    if(!password){
      setError("Please enter the password");
      return;
    }

    setError("")

    try{
      if(profilePic){
        const imgUploadRes=await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name:fullName,
        email,
        password,
        profileImageUrl,
      });

      const {token} = response.data;

      if(token){
        localStorage.setItem("token",token);
        navigate("/dashboard");
      }
    }
    catch(error){
      if(error.response && error.response.date.message){
        setError(error.response.data.message)
      }else{
        setError("something went wrong.please try again")
      }
    }
  }

  const handleSubmit=async(e)=>{

  }

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center ">
      <h3 className="text-lg font-semibold text-black">Create an account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">Join Us today by entering your details below</p>

      <form onSubmit={handleSignUp}>

        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={fullName}
            onChange={({target})=>setFullName(target.value)}
            label="FullName"
            placeholder="Harish"
            type="text"
          />

          <Input
            value={email}
            onChange={({target})=>setEmail(target.value)}
            label="Email Address"
            placeholder="harish@gmail.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({target})=>setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        <button type="submit" className="btn-primary">
          SIGNUP
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Already an Account?{""}
          <button className="font-medium text-primary underline cursor-pointer" onClick={()=>setCurrentPage("login")}>Login</button>
        </p>
      </form>
    </div>
  )
}

export default SignUp
