import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate, useParams } from 'react-router-dom'
import img from "../../assets/empty.jpg"
import { FaEdit } from 'react-icons/fa'
import axios from 'axios'
import { serverUrl } from '../../App'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setCourseData } from '../../redux/courseSlice'

function EditCourse() {
  const navigate = useNavigate()
  const {courseId} = useParams()
  const thumb = useRef()
  const [isPublished,setIsPublished] = useState(false)
  const [loading,setLoading] = useState(false)
  const [loading1,setLoading1] = useState(false)
  const dispatch = useDispatch()
  const {courseData} = useSelector(state=>state.course)

  const [selectedCourse,setSelectedCourse] = useState(null)
  const [title,setTitle] = useState("")
  const [subTitle,setSubTitle] = useState("")
  const [description,setDescription] = useState("")
  const [category,setCategory] = useState("")
  const [level,setLevel] = useState("")
  const [price,setPrice] = useState("")
  const [frontendImage,setFrontImage] = useState(img)
  const [backendImage,setBackendImage] = useState(null)

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontImage(URL.createObjectURL(file))
  }

  const getCourseById = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`,{withCredentials:true})
      setSelectedCourse(result.data)
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleEditCourse = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append("title",title)
    formData.append("subTitle",subTitle)
    formData.append("description",description)
    formData.append("category",category)
    formData.append("level",level)
    formData.append("price",price)
    formData.append("thumbnail",backendImage)
    formData.append("isPublished",isPublished)
    try {
      const result = await axios.post(`${serverUrl}/api/course/editcourse/${courseId}`,formData,{withCredentials:true})
      const updatedData = result.data

      if(updatedData.isPublished){
        const updatedCourses = courseData.map(c=> c._id === courseId ? updatedData : c)
        if(!courseData.some(c=> c._id === courseId)){
          updatedCourses.push(updatedData)
        }
        dispatch(setCourseData(updatedCourses))
      }else{
        const filterCourses = courseData.filter(c=>c._id !== courseId)
        dispatch(setCourseData(filterCourses))
      }

      setLoading(false)
      toast.success("Course Updated");
      navigate(-1)
    } catch (error) {
      setLoading(false)
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  const handleRemoveCourse = async () => {
    setLoading1(true)
    try {
      const result = await axios.delete(`${serverUrl}/api/course/remove/${courseId}`,{withCredentials:true})
      console.log(result.data);
      const filterCourses = courseData.filter(c=>c._id !== courseId)
      dispatch(setCourseData(filterCourses))
      setLoading1(false)
      toast.success("Course Removed")
      navigate('/courses')
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      setLoading1(false)
    }
  }

  useEffect(()=>{
    if(selectedCourse){
      setTitle(selectedCourse?.title || "")
      setSubTitle(selectedCourse?.subTitle || "")
      setDescription(selectedCourse?.description || "")
      setCategory(selectedCourse?.category || "")
      setLevel(selectedCourse?.level || "")
      setPrice(selectedCourse?.price || "")
      setFrontImage(selectedCourse?.thumbnail || img)
      setIsPublished(selectedCourse?.isPublished)
    }
  },[selectedCourse])

  useEffect(()=> {
    getCourseById()
  },[])

  return (
    <div className='max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md'>

      {/* top bar */}
      <div className='flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row mb-6 relative'>
        <FaArrowLeftLong onClick={()=>navigate(-1)} className='w-[22px] h-[22px] absolute top-[-20%] md:top-[20%] left-[0] md:left-[2%] cursor-pointer' />
        <h2 className='text-2xl font-semibold md:pl-[60px]'>Add Detail Information regarding the Course</h2>
        <div className='space-x-2 space-y-2'>
          <button onClick={()=>navigate(`/createlecture/${selectedCourse._id}`)} className='bg-black cursor-pointer text-white px-4 py-2 rounded-md'>Go to Lecture page</button>
        </div>
      </div>

      {/* form details */}
      <div className='bg-gray-50 p-6 rounded-md'>
        <h2 className='text-lg font-medium mb-4'>Basic Course Information</h2>
        <div className='space-x-2 space-y-2'>
          {!isPublished ? <button className='bg-green-100 text-green-600 px-4 py-2 rounded-md border-1' onClick={()=>setIsPublished(prev=>!prev)}>Click to Publish</button> : <button className='bg-red-100 text-red-600 px-4 py-2 rounded-md border-1' onClick={()=>setIsPublished(prev=>!prev)}>Click to UnPublish</button>}
          <button onClick={handleRemoveCourse} className='bg-red-600 text-white px-4 py-2 rounded-md'>{loading1 ? <ClipLoader size={30} color='white' /> : "Remove Course"}</button>
        </div>

        <form className='space-y-6' onSubmit={(e)=>e.preventDefault()}>
          <div>
            <label htmlFor="title" className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
            <input onChange={(e)=>setTitle(e.target.value)} value={title} id='title' type="text" className='w-full border px-4 py-2 rounded-md' placeholder='CourseTitle' />
          </div>
          <div>
            <label htmlFor="subtitle" className='block text-sm font-medium text-gray-700 mb-1'>Subtitle</label>
            <input onChange={(e)=>setSubTitle(e.target.value)} value={subTitle} id='subtitle' type="text" className='w-full border px-4 py-2 rounded-md' placeholder='Course Subtitle' />
          </div>
          <div>
            <label htmlFor="des" className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
            <textarea onChange={(e)=>setDescription(e.target.value)} value={description} id='des' type="text" className='w-full border px-4 py-2 rounded-md h-24 resize-none' placeholder='Course Description' ></textarea>
          </div>
          <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0'>
            {/* for category */}
            <div className='flex-1'>
              <label htmlFor="des" className='block text-sm font-medium text-gray-700 mb-1'>Course Category</label>
              <select onChange={(e)=>setCategory(e.target.value)} value={category} name="" id="" className='w-full border px-4 py-2 rounded-md bg-white'>
                <option value="">Select Category</option>
                <option value="App Development">App Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="UI UX Designing">UI UX Designing</option>
                <option value="Web Development">Web Development</option>
                <option value="Others">Others</option>
              </select>
            </div>
            {/* for Level */}
            <div className='flex-1'>
              <label htmlFor="des" className='block text-sm font-medium text-gray-700 mb-1'>Course Level</label>
              <select onChange={(e)=>setLevel(e.target.value)} value={level} name="" id="" className='w-full border px-4 py-2 rounded-md bg-white'>
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            {/* for price */}
            <div className='flex-1'>
              <label htmlFor="price" className='block text-sm font-medium text-gray-700 mb-1'>Course Price (INR)</label>
              <input onChange={(e)=>setPrice(e.target.value)} value={price} id='price' type="number" className='w-full border px-4 py-2 rounded-md' placeholder='₹' />
            </div>
          </div>
          <div>
              <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>Course Thumbnail</label>
              <input type="file" onChange={handleThumbnail} hidden ref={thumb} accept='image/*' />
            </div>
          <div className='relative w-[300px] h-[170px]'>
              <img src={frontendImage} alt="" className='w-[100%] h-[100%] border-1 border-black rounded-[5px]' onClick={()=>thumb.current.click()} />
              <FaEdit className='w-[20px] h-[20px] absolute top-2 right-2' onClick={()=>thumb.current.click()} />
          </div>
          <div className='flex items-center justify-start gap-[15px]'>
            <button onClick={()=>navigate(`/courses`)} className='bg-[#e9e8e8] hover:bg-red-200 text-black border-1 border-black cursor-pointer px-4 py-2 rounded-md'>Cancel</button>
            <button onClick={handleEditCourse} className='bg-black text-white px-7 py-2 rounded-md hover:bg-gray-500 cursor-pointer'>{loading ? <ClipLoader size={30} color='white' /> : "Save"}</button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default EditCourse
