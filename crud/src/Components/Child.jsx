import { useState } from "react";
import Loader from "./Loader";

const Child = ({ users, handleEdit, updateForm,deleteForm }) => {
  return (
    <div className="mt-4">
      <h3>Submitted Data</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Password</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Language</th>
            <th>Agreed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id || index}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{"*".repeat(user.password?.length || 0)}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
                <td>{user.language}</td>
                <td>{user.agreed ? "Yes" : "No"}</td>
                <td>
                  
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={()=>deleteForm(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  <Loader loading={loading} />;
};

export default Child;
