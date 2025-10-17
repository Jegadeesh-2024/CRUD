import { useEffect, useState } from "react";

const Edit = ({
  editInfo,
  editModal,
  closeModal,
  updateForm,
  validateEditModalUpdate,
  validate
}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    gender: "",
    language: "",
    agreed: false,
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editInfo) {
      setFormData({
        username: editInfo.username || "",
        password: editInfo.password || "",
        email: editInfo.email || "",
        gender: editInfo.gender || "",
        language: editInfo.language || "",
        agreed: editInfo.agreed || false,
      });
    }
  }, [editInfo]);

  return (
    <div>
      {editModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5>EditUsers</h5>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="">username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {!validateEditModalUpdate && errors.username && (
                    <small className="text-danger">{errors.username[0]}</small>
                  )}
                </div>
                {/* {editsubmittedData.username && <span>user name is requried{editsubmittedData.username}</span>} */}

                <div className="mb-3">
                  <label htmlFor="">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="">Gender</label>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      className="form-check-input"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                    />
                    <label htmlFor="">Male</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      className="form-check-input"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                    />
                    <label htmlFor="">Female</label>
                  </div>
                </div>
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
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                {/* <button onClick={()=>updateForm(formData)}>Update</button> */}
                <button
                  onClick={async () => {
                    if (validate()) {
                      await updateForm();
                      setformData({
                        username: "",
                        password: "",
                        confirm: "",
                        email: "",
                        gender: "",
                        language: "",
                        agreed: false,
                      });
                    }
                  }}
                >
                  update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;
