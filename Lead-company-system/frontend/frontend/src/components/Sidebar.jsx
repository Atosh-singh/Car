import { Layout, Menu } from "antd";
import { DashboardOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

function Sidebar() {

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to="/leads">Leads</Link>
    }
  ];

  return (
    <Sider width={220}>
      <Menu
        theme="dark"
        mode="inline"
        items={menuItems}
      />
    </Sider>
  );
}

export default Sidebar;