import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormError from "../../components/FormError";
import { userRegister } from "./authapi.js";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
  });

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

    // Additional password validation
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

      if (response.status === 200) {
        alert("Successfully Registered");
        navigate("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">Join us today</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleData}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your first name"
              required
            />
            <FormError errors={errors.FirstName} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="LastName"
              value={formData.LastName}
              onChange={handleData}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your last name"
              required
            />
            <FormError errors={errors.LastName} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleData}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
            <FormError errors={errors.Email} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleData}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
              required
              minLength={8}
              autoComplete="current-password"
            />
            <FormError errors={errors.Password} />
          </div>

          {errors.api && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <span className="text-red-600 text-sm">{errors.api}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
