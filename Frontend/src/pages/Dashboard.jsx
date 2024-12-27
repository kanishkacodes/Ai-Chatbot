import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Chat from "../components/Chat/Chat";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) navigate("/"); // Redirect to login if not logged in
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNavigateHome = () => {
    navigate("/"); // Navigate to Home page
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-lg font-bold text-gray-700">
          Welcome, {user.username}!
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleNavigateHome}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl h-full bg-white shadow-lg rounded-md p-6 lg:max-w-6xl">
          <Chat />
        </div>
      </div>
    </div>
  
  );
};

export default Dashboard;
