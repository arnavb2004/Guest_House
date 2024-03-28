import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications } from '../redux/notificationSlice';

const NotificationMenu = () => {
  // const dispatch = useDispatch();
  // const notifications = useSelector((state) => state.user.notifications);
  const dummyNotifications = [
    { id: 1, message: 'Notification 1' , title: "Accepted", date: "12-12-23"},
    { id: 2, message: 'Notification 2' , title: "Pending", date: "12-12-23"},
    { id: 3, message: 'Notification 3' , title: "Pending", date: "12-12-23"},
    { id: 4, message: 'Notification 4' , title: "Pending", date: "12-12-23"}
  ];
  const notifications = dummyNotifications 
  
  return (
    <div className="absolute z-[999] right-0 mt-4 w-64 bg-white border border-gray-300 rounded shadow-lg">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">Notifications</h2>
        {/* {loading && <p>Loading...</p>} */}
        {/* {error && <p className="text-red-500">Error: {error}</p>} */}
        {/* {!loading && !error && notifications.length === 0 && (
          <p>No notifications</p>
        )} */}
        {notifications.length > 0 && (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="mb-2">
                <div className="bg-gray-100 p-2 rounded">
                  <p className="text-sm font-semibold">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.message}</p>
                  <p className="text-xs text-gray-400">{notification.date}</p>
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
