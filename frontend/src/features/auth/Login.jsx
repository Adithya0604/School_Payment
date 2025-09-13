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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-md p-10 max-w-md w-full flex flex-col space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="flex flex-col">
            <label htmlFor="Email" className="mb-1 text-gray-700 font-medium">
              Email
            </label>
            <input
              id="Email"
              type="email"
              name="Email"
              placeholder="Enter your email"
              value={formData.Email}
              onChange={handleChange}
              autoComplete="Email"
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <FormError error={errors.Email} />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="Password"
              className="mb-1 text-gray-700 font-medium"
            >
              Password
            </label>
            <input
              id="Password"
              type="Password"
              name="Password"
              placeholder="Enter your password"
              value={formData.Password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <FormError error={errors.Password} />
          </div>

          {errors.api && (
            <div className="bg-red-100 border border-red-300 rounded-md p-3 text-red-700 text-sm">
              {errors.api}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              isLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-gray-700 text-sm space-y-2">
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Sign up
            </button>
          </p>
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
