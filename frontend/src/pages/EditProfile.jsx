import axios from 'axios'
import React, { useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

function EditProfile() {
    const {userData} = useSelector(state=>state.user)
    const navigate = useNavigate()
    const [name,setName] = useState(userData?.name || "")
    const [description,setDescription] = useState(userData?.description || "")
    const [photoUrl,setPhotoUrl] = useState(null)
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()

    const formData = new FormData()
    formData.append("name",name)
    formData.append("description",description)
    formData.append("photoUrl",photoUrl)

    const handleEditProfile = async ()=> {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/user/profile`,formData, {withCredentials:true})
            dispatch(setUserData(result.data))
            setLoading(false)
            navigate("/profile")
            toast.success("Profile Updated")
        } catch (error) {
            setLoading(false)
            console.log(error);
            toast.success(error.response.data.message)
        }
    }

  return (
    <div className='min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center'>
      <div className='bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative'>
        <FaArrowLeftLong onClick={()=>navigate("/profile")} className='absolute top-[5%] left-[5%] w-[22px] h-[22px] cursor-pointer' />
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Edit Profile</h2>
        <form className='space-y-5' onSubmit={(e)=>e.preventDefault()}>
            <div className='flex flex-col items-center text-center'>
                {userData?.photoUrl ? <img src={userData?.photoUrl} className='w-24 h-24 rounded-full object-cover border-4 border-[black]' alt="" /> : <div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black border-[white]'>{userData?.name.slice(0,1).toUpperCase()}</div>}
            </div>

            <div className=''>
                <label htmlFor="image" className='text-2m font-medium text-gray-700'>Select Avatar</label>
                <input onChange={(e)=>setPhotoUrl(e.target.files[0])} id='image' name='photoUrl' accept='image/*' placeholder='PhotoUrl' type="file" className='w-full px-4 py-2 border rounded-md text-sm' />
            </div>
            <div className=''>
                <label htmlFor="name" className='text-2m font-medium text-gray-700'>UserName</label>
                <input onChange={(e)=>setName(e.target.value)} value={name} id='name' placeholder={userData?.name} type="text" className='w-full px-4 py-2 border rounded-md text-sm' />
            </div>
            <div className=''>
                <label className='text-2m font-medium text-gray-700'>Email</label>
                <input readOnly placeholder={userData?.email} type="email" className='w-full px-4 py-2 border rounded-md text-sm' />
            </div>
            <div className=''>
                <label className='text-2m font-medium text-gray-700'>Bio</label>
                <textarea onChange={(e)=>setDescription(e.target.value)} value={description} rows={3} name='description' placeholder='Tell us about yourself' className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-[black]' />
            </div>
            <button onClick={handleEditProfile} className=' w-full py-2 rounded-md bg-[black] font-medium text-white active:bg-[#454545] cursor-pointer transition' disabled={loading}>{loading ? <ClipLoader size={30} color='white' /> : "Save Changes"}</button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
