import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'

const getCreatorCourse = () => {
    const dispatch = useDispatch()
    const {creatorCourseData} = useSelector((state)=>state.course)
    const {userData} = useSelector((state)=>state.user)
    useEffect(()=>{
        const creatorCourses = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/course/getcreator`,{withCredentials:true})
                console.log(result.data);
                dispatch(setCreatorCourseData(result.data))
            } catch (error) {
                console.log(error);
            } 
        }
        if(!creatorCourseData){
          creatorCourses()
        }
    },[userData,dispatch])
}

export default getCreatorCourse