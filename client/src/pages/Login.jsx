import React from "react";

const Login = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex flex-col items-center justify-center bg-[#365899] text-white p-5">
        <img
          className="h-24 text-white "
          src="https://upload.wikimedia.org/wikipedia/en/f/f9/Indian_Institute_of_Technology_Ropar_logo.png"
        />
        {/* <img className="h-24 " src="https://www.iitrpr.ac.in/sites/default/files/logo_0_2.png" /> */}
        {/* <img className="h-24 " src="https://www.iitrpr.ac.in/sites/default/files/logo_0_2.png" /> */}
        <div className="text-3xl font-semibold p-2">
          Welcome to Guest House Portal
        </div>
        <div className="font-medium">
          Indian Institute of Technology, Ropar(Punjab)
        </div>
      </div>

      <div className="flex justify-center items-center h-full border bg-[#f4f4f4]">
        <div className="flex flex-col border justify-center items-center w-[29%] bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="p-2 text-3xl font-semibold bg-[#3498db] text-white w-full text-center">
            Welcome
          </div>

          <div className="m-5 flex flex-col items-center w-full ">
            <div className=" font-semibold text-2xl">LOG IN</div>

            <div className="w-full p-5 flex flex-col gap-5">
              <input
                placeholder="Username"
                className="p-2 border rounded-md text-sm h-12 w-full "
              />
              <input
                placeholder="Password"
                className="p-2 border rounded-md text-sm h-12 w-full "
              />
              <button className="border bg-black text-white w-full p-2 rounded-lg">
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
