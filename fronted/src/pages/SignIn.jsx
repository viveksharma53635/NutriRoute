import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/apiService";
import { LoginContext } from "../context/LoginContext";
import "bootstrap/dist/css/bootstrap.min.css";

function SignIn() {
  const { login } = useContext(LoginContext);
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getErrorMessage = (error) => {
    const apiMessage = error?.response?.data?.message;
    const validationErrors = error?.response?.data?.errors;

    if (apiMessage) {
      if (validationErrors && typeof validationErrors === "object") {
        const firstValidationMessage = Object.values(validationErrors)[0];
        return firstValidationMessage || apiMessage;
      }
      return apiMessage;
    }

    return "Login failed. Please check your email and password.";
  };

  const onSubmit = async (data) => {
    setServerMessage("");
    setIsSubmitting(true);

    try {
      const response = await authService.login(data);
      const userData = response.data?.userDto;
      const jwtToken = response.data?.token;
      const isSuccess = response.data?.success ?? Boolean(userData && jwtToken);

      if (isSuccess && userData && jwtToken) {
        login(userData, jwtToken);
        const userRole = userData.role?.roleName || userData.role;

        if (userRole === "ROLE_ADMIN" || userRole === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (userRole === "ROLE_COACH" || userRole === "COACH") {
          navigate("/coach/dashboard");
        } else if (userRole === "ROLE_USER" || userRole === "USER") {
          navigate("/userdashboard");
        } else {
          navigate("/userdashboard");
        }
      } else {
        setServerMessage("Login failed. Invalid response from server.");
      }
    } catch (error) {
      setServerMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
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
                <h2 className="fw-bold mb-1">NutriRoute 🥗</h2>
                <p className="mb-0 small">
                  Login to continue your diet planning journey
                </p>
              </div>

              {/* Body */}
              <div className="card-body p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {serverMessage && (
                    <div className="alert alert-danger" role="alert">
                      {serverMessage}
                    </div>
                  )}

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

                    {errors.password && (
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <p className="mb-1 small text-muted">
                    Role-based access for Admin & User
                  </p>
                  <p className="mb-0">
                    Don't have an account?{" "}
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

export default SignIn;
