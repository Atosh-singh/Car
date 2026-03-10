import { Button } from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">

      <h2 className="font-semibold text-lg">CRM Dashboard</h2>

      <div className="flex items-center gap-4">

        <span className="text-gray-600">
          {user?.name || "Admin"}
        </span>

        <Button danger onClick={handleLogout}>
          Logout
        </Button>

      </div>

    </div>
  );
}

export default Navbar;