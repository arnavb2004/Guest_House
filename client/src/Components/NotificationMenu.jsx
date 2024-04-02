import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
// import { fetchNotifications } from '../redux/notificationSlice';
import { useState } from 'react';
import { privateRequest } from '../utils/useFetch';
import { toast } from 'react-toastify';
import {getDate} from '../utils/handleDate';
const NotificationMenu = () => {
  // const dispatch = useDispatch();
  // const notifications = useSelector((state) => state.user.notifications);
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.user);
  const [status, setStatus] = useState("Loading");
  const makeRequest = privateRequest(user.accessToken, user.refreshToken);
  const fetchNotifications = async () => {
    try {
      const res = await makeRequest.get("/user/notifications");
      // console.log(res.data)
      // setValues(res.data.map((res) => res._id));
      setNotifications(res.data);
      // setNewUsers(res.data);
      setStatus("Success");
    } catch (err) {
      if(err.response?.data?.message)
        toast(err.response.data.message);
      else  
        toast("Error fetching notifications");
      setStatus("Error");
      console.log(err.response.data);
    }
  };
  useEffect(() => {
    setStatus("Loading");
    fetchNotifications();
  }, []);
  const navigate=useNavigate();
  // const dummyNotifications = [
  //   { id: 1, message: 'Notification 1' , title: "Accepted", date: "12-12-23"},
  //   { id: 2, message: 'Notification 2' , title: "Pending", date: "12-12-23"},
  //   { id: 3, message: 'Notification 3' , title: "Pending", date: "12-12-23"},
  //   { id: 4, message: 'Notification 4' , title: "Pending", date: "12-12-23"}
  // ];
  // const notifications = dummyNotifications 
  const handleReservationRedirect= async(res_id,not_id)=>{
    await makeRequest.put(`/user/notifications/delete/${not_id}`);
    //redirect to reservation page
    navigate(`/${user.role.toLowerCase()}/reservation/${res_id}`);
    console.log(res_id);
  }
  return (
    <div className="absolute z-[999] right-0 mt-4 w-64 bg-white border border-gray-300 rounded shadow-lg">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2 ">Notifications</h2>
        {/* {loading && <p>Loading...</p>} */}
        {/* {error && <p className="text-red-500">Error: {error}</p>} */}
        {/* {!loading && !error && notifications.length === 0 && (
          <p>No notifications</p>
        )} */}
        {notifications.length > 0 && (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.res_id} className="mb-2">
                <div className="bg-gray-100 p-2 rounded cursor-pointer" onClick={()=>handleReservationRedirect(notification.res_id,notification._id)}>
                  <p className="text-sm font-semibold">{notification.sender}</p>
                  <p className="text-xs text-gray-500" >{notification.message}</p>
                  <p className="text-xs text-gray-400">{getDate(notification.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationMenu;
