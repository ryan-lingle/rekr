import React, { useRef } from "react";

const AdminLogin = () => {
  const token = useRef();

  function login(e) {
    e.preventDefault();
    localStorage.setItem("__admin_token__", token.current.value);
    window.location = "/admin/dashboard";
  };

  return(
    <form onSubmit={login}>
      <input ref={token} />
    </form>
  )
};

export default AdminLogin;
