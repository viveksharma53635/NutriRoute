import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { authService } from "../services/apiService";
import { LoginContext } from "../context/LoginContext";
import "../styles/registration.css";

const Register = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { login } = useContext(LoginContext);
  const [step, setStep] = useState(1);
  const [serverMessage, setServerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coaches, setCoaches] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gender: "male",
      goal: "maintenance",
      coachId: "",
    },
  });

  const password = watch("password");

  React.useEffect(() => {
    const loadCoaches = async () => {
      try {
        const response = await authService.getAvailableCoaches();
        setCoaches(response.data || []);
      } catch (error) {
        console.error("Failed to load coaches", error);
      }
    };

    loadCoaches();
  }, []);

  const getErrorMessage = (error) => {
    const apiMessage = error?.response?.data?.message;
    const validationErrors = error?.response?.data?.errors;

    if (validationErrors && typeof validationErrors === "object") {
      const firstValidationMessage = Object.values(validationErrors)[0];
      if (firstValidationMessage) {
        return firstValidationMessage;
      }
    }

    return apiMessage || "Registration failed. Please check the form and try again.";
  };

  const onSubmit = async (data) => {
    setServerMessage("");
    setIsSubmitting(true);

    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      age: Number(data.age),
      gender: data.gender,
      weightKg: parseFloat(data.weightKg),
      heightCm: parseFloat(data.heightCm),
      profession: data.profession,
      goal: data.goal,
      coachId: data.coachId || null,
    };

    try {
      const response = await authService.register(payload);
      const user = response.data?.userDto;
      const token = response.data?.token;
      const isSuccess = response.data?.success ?? Boolean(user && token);

      if (!isSuccess || !user || !token) {
        throw new Error("Invalid registration response");
      }

      login(user, token);

      if (setIsLoggedIn) setIsLoggedIn(true);

      navigate("/userdashboard");
    } catch (error) {
      setServerMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate = [];

    if (step === 1)
      fieldsToValidate = ["fullName", "email", "password", "confirmPassword"];

    if (step === 2)
      fieldsToValidate = ["age", "weightKg", "heightCm"];

    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center bg-light">
      <div
        className="card p-4 shadow-lg border-0"
        style={{
          maxWidth: "500px",
          width: "100%",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-center mb-4 text-success fw-bold">
          Join NutriRoute
        </h2>

        <div className="d-flex justify-content-between mb-4">
          <span className={`badge rounded-pill ${step >= 1 ? "bg-success" : "bg-secondary"}`}>
            1. Account
          </span>

          <span className={`badge rounded-pill ${step >= 2 ? "bg-success" : "bg-secondary"}`}>
            2. Health
          </span>

          <span className={`badge rounded-pill ${step >= 3 ? "bg-success" : "bg-secondary"}`}>
            3. Lifestyle
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {serverMessage && (
            <div className="alert alert-danger" role="alert">
              {serverMessage}
            </div>
          )}

          {step === 1 && (
            <>
              <h5 className="mb-3 text-secondary">Account Details</h5>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Full Name
                </label>

                <input
                  type="text"
                  className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                  {...register("fullName", {
                    required: "Name is required",
                  })}
                />

                {errors.fullName && (
                  <div className="invalid-feedback">
                    {errors.fullName.message}
                  </div>
                )}
              </div>

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Email
                </label>

                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  {...register("email", {
                    required: "Email required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email",
                    },
                  })}
                />

                {errors.email && (
                  <div className="invalid-feedback">
                    {errors.email.message}
                  </div>
                )}

              </div>

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Password
                </label>

                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  {...register("password", {
                    required: "Password required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />

                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
                  </div>
                )}

              </div>

              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Confirm Password
                </label>

                <input
                  type="password"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />

                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword.message}
                  </div>
                )}

              </div>

              <button
                type="button"
                className="btn btn-success w-100 py-2"
                onClick={nextStep}
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h5 className="mb-3 text-secondary">
                Health Metrics
              </h5>

              <div className="row mb-3">

                <div className="col">
                  <label className="form-label">Age</label>

                  <input
                    type="number"
                    className={`form-control ${errors.age ? "is-invalid" : ""}`}
                    {...register("age", { required: "Age is required", min: { value: 1, message: "Age must be greater than 0" } })}
                  />
                  {errors.age && <div className="invalid-feedback">{errors.age.message}</div>}
                </div>

                <div className="col">
                  <label className="form-label">Gender</label>

                  <select
                    className="form-select"
                    {...register("gender")}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

              </div>

              <div className="row mb-3">

                <div className="col">

                  <label className="form-label">
                    Weight (kg)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    className={`form-control ${errors.weightKg ? "is-invalid" : ""}`}
                    {...register("weightKg", { required: "Weight is required" })}
                  />
                  {errors.weightKg && <div className="invalid-feedback">{errors.weightKg.message}</div>}

                </div>

                <div className="col">

                  <label className="form-label">
                    Height (cm)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    className={`form-control ${errors.heightCm ? "is-invalid" : ""}`}
                    {...register("heightCm", { required: "Height is required" })}
                  />
                  {errors.heightCm && <div className="invalid-feedback">{errors.heightCm.message}</div>}

                </div>

              </div>

              <div className="d-flex gap-2">

                <button
                  type="button"
                  className="btn btn-outline-secondary w-50"
                  onClick={prevStep}
                >
                  Back
                </button>

                <button
                  type="button"
                  className="btn btn-success w-50"
                  onClick={nextStep}
                >
                  Next
                </button>

              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h5 className="mb-3 text-secondary">
                Lifestyle
              </h5>

              <div className="mb-3">

                <label className="form-label">
                  Profession
                </label>

                <select
                  className={`form-select ${errors.profession ? "is-invalid" : ""}`}
                  {...register("profession", { required: "Profession is required" })}
                >
                  <option value="student">Student</option>
                  <option value="working">Working Professional</option>
                </select>
                {errors.profession && <div className="invalid-feedback">{errors.profession.message}</div>}

              </div>

              <div className="mb-4">

                <label className="form-label">
                  Goal
                </label>

                <select
                  className="form-select"
                  {...register("goal")}
                >
                  <option value="fat_loss">Fat Loss</option>
                  <option value="maintenance">Maintenance</option>
                </select>

              </div>

              <div className="mb-4">
                <label className="form-label">
                  Select Coach
                </label>

                <select
                  className="form-select"
                  {...register("coachId")}
                >
                  <option value="">No coach selected</option>
                  {coaches.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.fullName} ({coach.email})
                    </option>
                  ))}
                </select>

                <small className="text-muted">
                  Choose a coach now if you want personal guidance after registration.
                </small>
              </div>

              <div className="d-flex gap-2">

                <button
                  type="button"
                  className="btn btn-outline-secondary w-50"
                  onClick={prevStep}
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="btn btn-success w-50 fw-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Complete"}
                </button>

              </div>
            </>
          )}

        </form>
      </div>
    </div>
  );
};

export default Register;
