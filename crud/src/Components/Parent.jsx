import { useEffect, useState } from "react";
import Child from "../Components/Child";
import axios from "axios";
import Loader from "./Loader";
import Edit from "./Edit";

const Parent = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    gender: "",
    language: "",
    agreed: false,
  });
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loading,setLoading] = useState(false)
  // const[editId,setEditId] = useState(null);
  const [editInfo, setEditInfo] = useState({});
  const [editModal,setEditModal] =useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const validate1 = validate();
    if (!validate1) {
      return;

    }
    if (editInfo) {
      updateForm();
      
    }else{
      create()
    }

    // add current formdata to user array
    
      
     

    setFormData({
      username: "",
      password: "",
      email: "",
      gender: "",
      language: "",
      agreed: false,
    });
    setErrors({});
  };

  // edit:
  const handleEdit =(user)=>{
    // setFormData({
    //   username:user.username,
    //   password:user.password,
    //   email:user.email,
    //   gender:user.gender,
    //   language:user.language,
    //   agreed:user.agreed
    // })
    //setEditId(user.id);
    setEditInfo(user);
    setEditModal(true)
  }

  const updateForm = async (updatedData) => {
    console.log(editInfo);
    
    await axios.put(`http://127.0.0.1:5000/props_forms/${editInfo.id}`, updatedData);
    alert("User updated ✅");
    fetch();
    setEditInfo({});
    closeModal()
  };

  const deleteForm = async (id) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete record with ID ${id}?`);
  if (!confirmDelete) {
    alert("❌ Delete cancelled");
    return;
  }

  try {
    await axios.delete(`http://127.0.0.1:5000/delete_forms/${id}`);
    alert("✅ Record deleted successfully!");
setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  } catch (err) {
    console.error(err);
  }
};


  const fetch = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://127.0.0.1:5000/props_form");
      setUsers(response.data);
    } catch (error) {
      console.log("Errordata", error);
    }
    finally{
      setLoading(false)
    }
  };
  const closeModal=()=>{
    setEditModal(false);
  setEditInfo({});
  }

  // post
  const create = async () => {
    try {

      setLoading(true);
      await axios.post("http://127.0.0.1:5000/props_forms", formData);
      alert("user created");
      fetch()
      
      console.log(formData);
    } catch (error) {
      console.error("Error", error.response?.data || error.message);

    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const validate = () => {
    let errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is requried";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is requried";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be entered in 6 characters";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is requried";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.gender) {
      errors.gender = "Gender choose is missing";
    }
    if (!formData.language) {
      errors.language = "choose any one lanaguage";
    }
    if (!formData.agreed) {
      errors.agreed = " Please tick the check box";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
// ✅ Validation
  const validateEditModalUpdate = () => {
    if (!formData.username.trim()) {
      alert("Username is required ❌");
      return false;
    }
    if (!formData.password.trim()) {
      alert("passoword is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      alert("Valid email is required ❌");
      return false;
    }
    if (!formData.gender) {
      alert("Please select gender ❌");
      return false;
    }
    if (!formData.language) {
      alert("Please select language ❌");
      return false;
    }
    return true;
  };


  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        {/* User Name */}
        <div className="mb-3">
          <label htmlFor="user_name" className="form-label">
            User Name
          </label>
          <input
            type="text"
            id="user_name"
            name="username"
            className="form-control"
            placeholder="Enter your name"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <small className="text-danger">{errors.username}</small>
          )}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <small className="text-danger">{errors.password}</small>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <small className="text-danger">{errors.email}</small>
          )}
        </div>

        {/* Gender */}
        <div className="mb-3">
          <label className="form-label d-block">Gender</label>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              className="form-check-input"
              checked={formData.gender === "male"}
              onChange={handleChange}
            />
            <label htmlFor="male" className="form-check-label">
              Male
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              className="form-check-input"
              checked={formData.gender === "female"}
              onChange={handleChange}
            />
            <label htmlFor="female" className="form-check-label">
              Female
            </label>
          </div>
          {errors.gender && (
            <small className="text-danger d-block">{errors.gender}</small>
          )}
        </div>

        {/* Language */}
        <div className="mb-3">
          <label htmlFor="code" className="form-label">
            Code Selection
          </label>
          <select
            id="code"
            className="form-select"
            name="language"
            value={formData.language}
            onChange={handleChange}
          >
            <option value="">-- Select a Language --</option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Bootstrap">Bootstrap</option>
            <option value="ReactJS">ReactJS</option>
            <option value="SQL">SQL</option>
          </select>
          {errors.language && (
            <small className="text-danger d-block">{errors.language}</small>
          )}
        </div>

        {/* Terms */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            id="terms"
            name="agreed"
            className="form-check-input"
            checked={formData.agreed}
            onChange={handleChange}
          />
          <label htmlFor="terms" className="form-check-label">
            I agree to the terms and conditions
          </label>
          {errors.agreed && (
            <small className="text-danger d-block">{errors.agreed}</small>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>
    {loading ? (
      <Loader loading={loading}/>
    ) : (
      <Child users={users} deleteForm={deleteForm}  handleEdit={handleEdit}/>
    )}
    <Edit editInfo={editInfo} validate={validate} validateEditModalUpdate={validateEditModalUpdate} updateForm={updateForm} editModal={editModal} closeModal={closeModal} />

      
    </div>
  );
};

export default Parent;
