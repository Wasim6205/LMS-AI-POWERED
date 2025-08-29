import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { setCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'

const getPublishedCourse = () => {
    const dispatch = useDispatch()
    const {courseData} = useSelector((state)=>state.course)
    const {userData} = useSelector((state)=>state.user)
    useEffect(()=>{
        const getCourseData = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/course/getpublished`,{withCredentials:true})
                console.log(result.data);
                dispatch(setCourseData(result.data))
            } catch (error) {
                console.log(error);
            } 
        }
        if(!courseData){
          getCourseData()
        }
    },[userData,courseData,dispatch])
}

export default getPublishedCourse