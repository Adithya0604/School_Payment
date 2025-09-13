import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "./authapi";
import { setAccessToken } from "../../utils/fetchWithAuth";
import FormError from "../../components/FormError";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setIsLoading(true);
    const newErrors = {};
    for (let field in formData) {
      if (!formData[field]) newErrors[field] = `${field} is required`;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    try {
      const response = await userLogin(formData);
      if (response.status === 200 && response.accessToken) {
        setAccessToken(response.accessToken);
        alert("Login Successful!");
        navigate("/dashboard");
      } else {
        setErrors({
          api:
            response.MissingFields || response.message || response.ExistedUser,
        });
      }
    } catch (error) {
      setErrors({ api: `Login failed. Please try again. ${error}` });
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
            padding: 15px;
            width: 100%;
          }
          .main-container {
            background-color: #1F2A33;
            width: 400px;
            max-width: 95vw;
            padding: 36px 40px;
            border-radius: 16px;
            box-shadow: 0 25px 45px rgba(0,0,0,0.6);
            border: 1px solid rgba(255 255 255 / 0.06);
          }
          .header-title {
            text-align: center;
            margin-bottom: 28px;
            color: #A7C7E7;
            font-size: 22px;
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
          .form-group {
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
          .forgot-password {
  display: block;
  margin-top: 20px;
  color: #8DA5AD;
  text-align: center; 
  width: 100%; 
  cursor: pointer; 
}
          .forgot-password:hover {
            color: #A9C8CD;
          }
        `}
      </style>

      <div className="page-container">
        <div className="main-container">
          <h1 className="header-title">Welcome Back</h1>
          <p className="header-subtitle">Sign in to your account</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="Email" className="label">
                Email Address
              </label>
              <input
                id="Email"
                type="email"
                name="Email"
                placeholder="Enter your email"
                value={formData.Email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              <FormError error={errors.Email} />
            </div>

            <div className="form-group">
              <label htmlFor="Password" className="label">
                Password
              </label>
              <input
                id="Password"
                type="password"
                name="Password"
                placeholder="Enter your password"
                value={formData.Password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <FormError error={errors.Password} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="footer-links">
            <p className="footer-text">
              Don't have an account?
              <button
                className="signup-link"
                onClick={() => navigate("/register")}
                type="button"
              >
                Sign up
              </button>
            </p>
            <button
              className="forgot-password"
              onClick={() => navigate("/register")}
              type="button"
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
