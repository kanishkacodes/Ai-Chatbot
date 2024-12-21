import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/login");
    }
  }, [navigate]);

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // To track if the message is an error or success
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = () => {
    if (form.username.length < 5) {
      setMessage("Username must be at least 5 characters long.");
      setIsError(true); // Mark as an error
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage("Please enter a valid email address.");
      setIsError(true); // Mark as an error
      return false;
    }
    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setIsError(true); // Mark as an error
      return false;
    }
    return true;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true); // Disable button while submitting
      const response = await axios.post("/auth/register", form, { withCredentials: true });

      // Save user data in localStorage and redirect
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setMessage("Registration successful!");
      setIsError(false); // Mark as a success message
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (error.response) {
        const serverMessage = error.response.data.message;

        // Handle specific backend error messages
        if (serverMessage.includes("username")) {
          setMessage("This username is already taken. Please choose another one.");
        } else if (serverMessage.includes("email")) {
          setMessage("An account with this email already exists. Try logging in.");
        } else {
          setMessage(serverMessage); // Fallback for other backend errors
        }
        setIsError(true); // Mark as an error
      } else {
        // Handle network or unexpected errors
        setMessage("Network error. Please check your connection and try again.");
        setIsError(true); // Mark as an error
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isSubmitting && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
