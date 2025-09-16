import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormError from "../../components/FormError";
import { userRegister } from "./authapi.js";
import Model from "../../components/Model.jsx";

function Register() {
  const navigate = useNavigate();
  const [model, setModel] = useState("");
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
  });

  console.log("FormData: 1", formData);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleData = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (event) => {

    event.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newError = {};
    for (let field in formData) {
      if (!formData[field]) {
        newError[field] = `${field} is required`;
      }
    }

    if (formData.Password && formData.Password.length < 8) {
      newError.Password = "Password must be at least 8 characters long";
    }

    if (Object.keys(newError).length) {
      setErrors(newError);
      setIsLoading(false);
      return;
    }


    try {

      const response = await userRegister(formData);


      if (response.status === 201) {
        setModel("Successfully Registered");
        setTimeout(() => {
          setModel("");
          navigate("/login");
        }, 1500);
      } else {
        setErrors({
          api:
            response.MissingFields || response.message || response.ExistedUser,
        });
      }
    } catch (error) {
      setErrors({
        api: `Registration failed. Please try again. ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          * {
            margin: 0; padding: 0; box-sizing: border-box;
          }
          html, body, #root {
            height: 100%;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #405D60 0%, #2F4858 100%);
            color: #E1EDE6;
            font-size: 14px;
          }
          .page-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            width: 100%;
          }
          .main-container {
            background-color: #1F2A33;
            width: 480px;
            max-width: 95vw;
            padding: 36px 44px;
            border-radius: 16px;
            box-shadow: 0 25px 45px rgba(0,0,0,0.6);
            border: 1px solid rgba(255 255 255 / 0.06);
          }
          .header-title {
            text-align: center;
            margin-bottom: 24px;
            color: #A7C7E7;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .header-subtitle {
            text-align: center;
            color: #B0C9D6;
            font-size: 14px;
            font-weight: 400;
            margin-bottom: 28px;
          }
          .form-row {
            display: flex;
            gap: 18px;
            margin-bottom: 18px;
          }
          .form-group {
            flex: 1;
          }
          .form-group-full {
            margin-bottom: 20px;
          }
          .label {
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 6px;
            display: block;
            color: #9FB8C7;
            letter-spacing: 0.4px;
          }
          input[type="text"],
          input[type="email"],
          input[type="password"] {
            width: 100%;
            padding: 12px 14px;
            border: 2px solid #4F6D7A;
            border-radius: 12px;
            font-size: 14px;
            background-color: #355468;
            color: #D5E1E8;
            transition: all 0.3s ease;
          }
          input[type="text"]:focus,
          input[type="email"]:focus,
          input[type="password"]:focus {
            border-color: #79A19B;
            outline: none;
            background-color: #4C6B72;
            box-shadow: 0 0 6px #79A19B;
            color: #E1EDE6;
          }
          input::placeholder {
            color: #ACC6C9;
            font-weight: 400;
          }
          .error-message {
            color: #F25F5C;
            font-size: 12px;
            margin-top: 4px;
            font-weight: 600;
          }
          .api-error {
            background-color: #922b2b29;
            color: #F25F5C;
            padding: 12px;
            border-radius: 10px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 16px;
            font-size: 13px;
          }
          .submit-button {
            width: 100%;
            padding: 14px;
            font-size: 15px;
            background: linear-gradient(135deg, #39603D 0%, #2E4F3F 100%);
            color: white;
            border: none;
            border-radius: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin-top: 8px;
            box-shadow: 0 4px 15px rgba(57,96,61,0.5);
          }
          .submit-button:hover:enabled {
            background: linear-gradient(135deg, #456E43 0%, #3A5F3F 100%);
            box-shadow: 0 8px 25px rgba(69,110,67,0.7);
            transform: translateY(-2px);
          }
          .submit-button:disabled {
            cursor: not-allowed;
            opacity: 0.6;
            box-shadow: none;
            transform: none;
          }
          .footer-links {
            margin-top: 32px;
            text-align: center;
            font-size: 13px;
            color: #B0C9D6;
          }
          .footer-text {
            margin-bottom: 12px;
          }
          .footer-links button {
            background: none;
            border: none;
            color: #8DA5AD;
            font-weight: 600;
            cursor: pointer;
            padding: 6px 10px;
            border-radius: 6px;
            transition: all 0.2s ease;
            font-size: 13px;
            text-decoration: none;
            margin-left: 4px;
          }
          .footer-links button:hover {
            color: #AAC9CE;
            background-color: rgba(255 255 255 / 0.1);
            text-decoration: none;
          }
          @media (max-width: 540px) {
            .form-row {
              flex-direction: column;
              gap: 14px;
            }
          }
        `}
      </style>

      <div className="page-container">
        <div className="main-container">
          <h1 className="header-title">Create Account</h1>
          <p className="header-subtitle">Join us today</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="label" htmlFor="FirstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="FirstName"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleData}
                  placeholder="First name"
                  required
                />
                <FormError error={errors.FirstName} />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="LastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="LastName"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleData}
                  placeholder="Last name"
                  required
                />
                <FormError error={errors.LastName} />
              </div>
            </div>

            {/* Email */}
            <div className="form-group-full">
              <label className="label" htmlFor="Email">
                Email Address
              </label>
              <input
                type="email"
                id="Email"
                name="Email"
                value={formData.Email}
                onChange={handleData}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
              <FormError error={errors.Email} />
            </div>

            {/* Password */}
            <div className="form-group-full">
              <label className="label" htmlFor="Password">
                Password
              </label>
              <input
                type="password"
                id="Password"
                name="Password"
                value={formData.Password}
                onChange={handleData}
                placeholder="Enter your password (min 8 characters)"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <FormError error={errors.Password} />
            </div>

            {/* API error */}
            {errors.api && <div className="api-error">{errors.api}</div>}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="footer-links">
            <p className="footer-text">
              Already have an account?
              <button
                className="signup-link"
                onClick={() => navigate("/login")}
                type="button"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
      {<Model message={model} />}
    </>
  );
}

export default Register;
