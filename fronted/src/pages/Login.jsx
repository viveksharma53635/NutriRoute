import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { authService } from "../services/apiService";
import { LoginContext } from "../../context/LoginContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {

  const {login}=useContext(LoginContext);

  const navigate=useNavigate();
  
  
  // useForm Hook

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // submitHandler

    const onSubmit =async (data) => {
    console.log(data);

    // api handling
    try
    {
    const response=await api.post('/auth/login',data);
    console.log(response);
    login(response.data.userDto,response.data.token)
    toast.success("Login successfull")

    if(response.data.userDto.role.roleName==="ROLE_USER")
      navigate("/user/dashboard")
    else
      navigate("/admin/dashboard")
    
    }
    catch(error)
    {
      console.log(error);  
      toast.error("login failed")
    }
  };

  return (
    <section className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4">
              {/* Header */}
              <div className="card-header bg-success text-white text-center py-4 rounded-top-4">
                <h2 className="fw-bold mb-1">EcoTrack 🌱</h2>
                <p className="mb-0 small">
                  Login to continue managing recycling responsibly
                </p>
              </div>

              {/* Body */}
              <div className="card-body p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      {...register("email", { required: "email is required" })}
                    />

                    {errors.email && (
                      <small className="text-danger">
                        {errors.email.message}
                      </small>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      {...register("password", { required: "password is required" })}
                    />

                    {errors.email && (
                      <small className="text-danger">
                        {errors.password.message}
                      </small>
                    )}
                  </div>

                  {/* Remember / Forgot */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label
                        className="form-check-label small"
                        htmlFor="rememberMe"
                      >
                        Remember me
                      </label>
                    </div>

                    <a href="#" className="text-success small fw-semibold">
                      Forgot password?
                    </a>
                  </div>

                  {/* Login Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg fw-semibold"
                    >
                      Login
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <p className="mb-1 small text-muted">
                    Same login for Admin & User
                  </p>
                  <p className="mb-0">
                    Don’t have an account?{" "}
                    <a href="/register" className="text-success fw-semibold">
                      Register
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
