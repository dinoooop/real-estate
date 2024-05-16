import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {

  const [error, setError] = useState('')
  const [isLoadind, setIsLoadind] = useState(false)
  const navigate = useNavigate()
  const {updateUser} = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoadind(true)
    setError("")
    
    
    const formData = new FormData(e.target)
    const username = formData.get("username")
    const password = formData.get("password")

    try {
      
      const res = await apiRequest.post("/auth/login", {
        username, password
      })
      
      updateUser(res.data)
      navigate("/profile")
    } catch (error) {
      console.log(error);
      setError(error.response.data.message)
    } finally {
      setIsLoadind(false)
    }

  }

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required type="text" placeholder="Username" defaultValue="admin" />
          <input name="password" type="password" placeholder="Password" defaultValue="welcome" />
          <button disabled={isLoadind}>Login</button>
          { error && <span>{error}</span> }
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
