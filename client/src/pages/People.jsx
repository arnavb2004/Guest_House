import React from "react";
import UserProfileBox from "../components/UserProfileBox";

const People = () => {
  const users = [
    {
      key: 1,
      name: "Prof1",
      post: "incharge1",
      email: "prof1@gmail.com",
      contact: "0123456781",
    },
    {
      key: 2,
      name: "Prof2",
      post: "incharge2",
      email: "prof2@gmail.com",
      contact: "0123456782",
    },
    {
      key: 3,
      name: "Prof3",
      post: "incharge3",
      email: "prof3@gmail.com",
      contact: "0123456783",
    },
    {
      key: 4,
      name: "Prof4",
      post: "incharge4",
      email: "prof4@gmail.com",
      contact: "0123456784",
    },
    {
      key: 5,
      name: "Prof5",
      post: "incharge5",
      email: "prof5@gmail.com",
      contact: "0123456785",
    },
    {
      key: 6,
      name: "Prof6",
      post: "incharge6",
      email: "prof6@gmail.com",
      contact: "0123456786",
    },
  ];

  return (
    <div className='people w-5/6 flex flex-wrap justify-around gap-18 gap-y-12 my-10'>
      {users.map((item, index) => {
        return <UserProfileBox key={"user-" + index} user={item} />;
      })}
    </div>
  );
};

export default People;
