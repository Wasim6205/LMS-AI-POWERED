import React, { useState } from 'react'
import logo from "../assets/logo.jpg"
import { IoPersonCircle } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios  from 'axios';
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import {RxHamburgerMenu} from "react-icons/rx"
import {GiSplitCross} from "react-icons/gi"

function Nav() {
    const {userData} = useSelector(state=>state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [show,setShow] = useState(false)
    const [showHam,setShowHam] = useState(false)

    const handleLogout = async ()=> {
        try {
          const result = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
          dispatch(setUserData(null))
          console.log(result.data);
          toast.success("Logout successfully")
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message)
        }
    }
  return (
    <div>
      <div className='w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#00000047] z-10'>
        <div className='lg:w-[20%] w-[40%] lg:pl-[50px]'>
            <img src={logo} alt="logo" className='w-[60px] rounded-[5px] border-2 border-white' />
        </div>
        <div className='w-[30%] lg:flex items-center justify-center gap-4 hidden'>
            {!userData && <IoPersonCircle className='w-[50px] h-[50px] fill-black cursor-pointer' onClick={()=>setShow(prev=>!prev)} />}
            {userData?.photoUrl ? <img onClick={()=>setShow(prev=>!prev)} src={userData?.photoUrl} className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer' /> : <div className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer' onClick={()=>setShow(prev=>!prev)}>
                {userData?.name.slice(0,1).toUpperCase()}
            </div>}
            {userData?.role==="educator" && <div className='px-[20px] py-[10px] border-2 border-white text-white bg-black rounded-[10px] text-[18px] font-light cursor-pointer' onClick={()=>navigate("/dashboard")}>Dashboard</div>}
            {!userData ? <span className='px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] font-light cursor-pointer bg-[#000000d5]' onClick={()=>navigate("/login")}>Login</span> :
            <span className='px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer' onClick={handleLogout}>LogOut</span>}
            {show && <div className='absolute top-[110%] right-[15%] flex items-center flex-col justify-center gap-2 text-[16px] rounded-md bg-[white] px-[15px] py-[10px] border-[2px] border-black hover:border-white hover:text-white cursor-pointer hover:bg-black'>
              <span className='bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600' onClick={()=>navigate("/profile")}>My Profile</span>
              <span onClick={()=>navigate('/mycourses')}  className='bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600'>My Courses</span>
            </div>}
        </div>

        <RxHamburgerMenu onClick={()=>setShowHam(prev=>!prev)} className='w-[35px] h-[35px] lg:hidden text-white cursor-pointer' />

        <div className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-10 lg:hidden ${showHam ? "translate-x-[0] trasition duration-500" : "translate-x-[-100%] trasition duration-500"}`}>
          <GiSplitCross onClick={()=>setShowHam(prev=>!prev)} className='w-[35px] h-[35px] fill-white absolute top-5 right-[4%]' />
          {!userData && <IoPersonCircle className='w-[50px] h-[50px] fill-black cursor-pointer' />}
          {userData?.photoUrl ? <img src={userData?.photoUrl} className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer' /> : <div className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer'>
              {userData?.name.slice(0,1).toUpperCase()}
          </div>}
          <div className='w-[200px] h-[65px] flex items-center justify-center border-2 border-white text-white bg-black rounded-[10px] text-[18px] font-light cursor-pointer' onClick={()=>navigate("/profile")}>My Profile</div>
          <div onClick={()=>navigate('/mycourses')} className='w-[200px] h-[65px] flex items-center justify-center border-2 border-white text-white bg-black rounded-[10px] text-[18px] font-light cursor-pointer'>My Courses</div>
          {userData?.role==="educator" && <div className='w-[200px] h-[65px] flex items-center justify-center border-2 border-white text-white bg-black rounded-[10px] text-[18px] font-light cursor-pointer' onClick={()=>navigate("/dashboard")}>Dashboard</div>}
          {!userData ? <span className='w-[200px] h-[65px] flex items-center justify-center border-2 border-white text-white bg-black rounded-[10px] text-[18px] font-light cursor-pointer' onClick={()=>navigate("/login")}>Login</span> :
            <span className='w-[200px] h-[65px] flex items-center justify-center border-2 border-white text-white bg-black rounded-[10px] text-[18px] font-light cursor-pointer' onClick={handleLogout}>LogOut</span>}
        </div>
      </div>
    </div>
  )
}

export default Nav
