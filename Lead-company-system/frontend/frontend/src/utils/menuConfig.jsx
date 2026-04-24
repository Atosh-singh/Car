import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CarOutlined,
  SafetyOutlined,
  KeyOutlined,
  SettingOutlined
} from "@ant-design/icons";

export const menuConfig = [

  // ✅ MAIN NAVIGATION
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    permission: "VIEW_DASHBOARD"
  },

  {
    key: "/leads",
    icon: <UserOutlined />,
    label: "Leads",
    permission: "VIEW_LEAD"
  },

  {
  key: "/google-meet",
  label: "Google Meet",
  icon: "🎥" // or Ant icon
},
 

  {
    key: "/teams",
    icon: <TeamOutlined />,
    label: "Teams",
    permission: "VIEW_TEAMS"
  },

  {
    type: "divider"
  },

  // ✅ ADMIN SECTION (CLEAN)
  {
    key: "admin",
    label: "Admin",
    roles: ["ADMIN", "SUPER_ADMIN"],

    children: [
      {
        key: "/users",
        icon: <TeamOutlined />,
        label: "Users",
        permission: "VIEW_USERS"
      },

      {
        key: "/roles",
        icon: <SafetyOutlined />,
        label: "Roles",
        permission: "VIEW_ROLE"
      },

      {
        key: "/permissions",
        icon: <KeyOutlined />,
        label: "Permissions",
        permission: "VIEW_PERMISSION"
      },

       {
    key: "/cars",
    icon: <CarOutlined />,
    label: "Cars",
    permission: "VIEW_CAR"
  },
      {
  key: "/admin/permissions",
  icon: <SettingOutlined />,
  label: "Permission Matrix"
},

      {
        key: "authorization",
        icon: <SettingOutlined />,
        label: "Authorization Panel"
      }
    ]
  }
];