import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import { authService } from "../services/apiService";
import "../styles/login.css";

function Login() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {

      const response = await authService.login(data.email, data.password);

      console.log("Login Success:", response.data);

      // store token
      localStorage.setItem("token", response.data.token);

      // redirect to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password");
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
                <h2 className="fw-bold mb-1">Welcome to NutriRoute</h2>
                <p className="mb-0 small">
                  Let's personalize your health journey responsibly
                </p>
              </div>

              {/* Body */}
              <div className="card-body p-4">

                <h4 className="text-center mb-4">Login</h4>

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
                      {...register("email", {
                        required: "Email is required"
                      })}
                    />

                    {errors.email && (
                      <small className="text-danger">
                        {errors.email.message}
                      </small>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required"
                      })}
                    />

                    {errors.password && (
                      <small className="text-danger">
                        {errors.password.message}
                      </small>
                    )}
                  </div>

                  {/* Remember me + Forgot */}
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
                    <Link
                      to="/register"
                      className="text-success fw-semibold"
                    >
                      Register
                    </Link>
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