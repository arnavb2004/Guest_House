import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";

const Register = () => {
  // const email = useSelector((state) => state.user.email);
  const [user, setUser] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
  });

  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const handleChange = (e) => {
    setUser((user) => ({ ...user, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    // dispatch(setUserSlice({ ...user }));
    navigate("/home");
    axios.post(BASE_URL + "/auth/register", { user });
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[40%] p-[20px]">
        <h1 className="text-2xl font-light">CREATE AN ACCOUNT</h1>
        <form className="flex flex-wrap">
          <input
            className="flex-1 min-w-[40%] mt-5 mr-3 p-2 border-black border-[1px]"
            placeholder="name"
            name="name"
            onChange={(e) => handleChange(e)}
          />
          <input
            className="flex-1 min-w-[40%] mt-5 mr-3 p-2 border-black border-[1px]"
            placeholder="contact"
            name="contact"
            pattern="[0-9]+"
            onChange={(e) => handleChange(e)}
          />
          <input
            className="flex-1 min-w-[40%] mt-5 mr-3 p-2 border-black border-[1px]"
            placeholder="email"
            name="email"
            disabled
            value={user.email}
            onChange={(e) => handleChange(e)}
          />
          <input
            className="flex-1 min-w-[40%] mt-5 mr-3 p-2 border-black border-[1px]"
            placeholder="address"
            name="address"
            onChange={(e) => handleChange(e)}
          />

          <input
            type="submit"
            className="w-[25%] border-none py-4 px-5 my-5 min-w-max bg-teal-400 text-white cursor-pointer"
            onClick={(e) => handleClick(e)}
            value="REGISTER"
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
