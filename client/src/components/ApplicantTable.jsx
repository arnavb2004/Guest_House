import React, { useState , useEffect} from "react";
import { useSelector } from "react-redux";

const Table = ({ entry, setEntry }) => {
  const user = useSelector((state) => state.user); 
  const [autoFill, setAutoFill] = useState(false); 

  const handleChange = (event, field) => {
    setEntry({ ...entry, [field]: event.target.value });
  };

  const handleAutoFill = (event) => {
    setAutoFill(event.target.checked);
    if (event.target.checked) {
      setEntry({
        name: user.name || "",
        mobile: user.contact || "",
        email: user.email || "",
        code : user.ecode || "",
        department : user.department ||"",
        designation : user.designation || "",
      });
    } else {
      setEntry({
        name: "",
        designation: "",
        department: "",
        code: "",
        mobile: "",
        email: "",
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <table className="border-collapse border-2 border-gray-500">
        <thead>
          <tr>
            <th className="border border-gray-500 px-4 py-2">Name*</th>
            <th className="border border-gray-500 px-4 py-2">Designation*</th>
            <th className="border border-gray-500 px-4 py-2">Department*</th>
            <th className="border border-gray-500 px-4 py-2">
              Employee Code/Entry Number*
            </th>
            <th className="border border-gray-500 px-4 py-2">Mobile Number*</th>
            <th className="border border-gray-500 px-4 py-2">Email*</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="text"
                value={entry.name}
                onChange={(event) => handleChange(event, "name")}
                className="w-full text-center"
              />
            </td>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="text"
                value={entry.designation}
                onChange={(event) => handleChange(event, "designation")}
                className="w-full text-center"
              />
            </td>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="text"
                value={entry.department}
                onChange={(event) => handleChange(event, "department")}
                className="w-full text-center"
              />
            </td>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="text"
                value={entry.code}
                onChange={(event) => handleChange(event, "code")}
                className="w-full text-center"
                readOnly
              />
            </td>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="text"
                value={entry.mobile}
                onChange={(event) => handleChange(event, "mobile")}
                className="w-full text-center"
              />
            </td>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="email"
                value={entry.email}
                onChange={(event) => handleChange(event, "email")}
                className="w-full text-center"
                readOnly
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="w-full flex items-center mt-4">
        <label className="flex flex-row items-center space-x-2">
          <input
            type="checkbox"
            checked={autoFill}
            onChange={handleAutoFill}
            className="cursor-pointer"
          />
          <span className="text-s font-medium">Auto-Fill with My Details</span>
        </label>
      </div>
    </div>
  );
};

export default Table;