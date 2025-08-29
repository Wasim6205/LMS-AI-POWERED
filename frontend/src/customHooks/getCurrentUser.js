import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

const getCurrentUser = ()=> {
  const dispatch = useDispatch();
  const {userData} = useSelector((state) => state.user)
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/getcurrentuser`, {
          withCredentials: true,
        });
        console.log(result.data);
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    if(!userData){
      fetchUser();
    }
  }, [userData,dispatch]);
}

export default getCurrentUser;


