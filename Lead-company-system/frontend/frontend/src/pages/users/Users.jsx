import { useEffect, useState } from "react";
import { Modal, Descriptions, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { getSocket } from "../../socket";

import { fetchUsers } from "../../redux/slices/userSlice";
import PageToolbar from "../../components/PageToolbar";
import UserTable from "../../components/users/UserTable";
import AppDrawer from "../../components/common/AppDrawer";
import UserForm from "../../components/users/UserForm";

function Users() {
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector((state) => state.users);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);

  // ✅ Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(users || []);
  }, [users]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // 🔥 SOCKET ONLINE USERS
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("online_users");
  }, []);

  // 🔍 SEARCH
  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();

    const filtered = (users || []).filter(
      (user) =>
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue)
    );

    setFilteredUsers(filtered);
  };

  // 👁 VIEW DETAILS (MODAL)
  const handleRowClick = (record) => {
    setSelectedUser(record);
    setOpen(true);
  };

  // ✏️ EDIT USER (DRAWER)
  const handleEditUser = (user) => {
    setEditingUser(user);
    setDrawerOpen(true);
  };

  // ➕ CREATE USER (DRAWER)
  const handleCreateUser = () => {
    setEditingUser(null);
    setDrawerOpen(true);
  };

  // ✅ SUBMIT FORM (ADD / UPDATE)
  const handleSubmit = async (values) => {
    try {
      console.log("Form Data:", values);

      // 👉 later connect redux create/update
      message.success("User saved successfully");

      setDrawerOpen(false);
      dispatch(fetchUsers());

    } catch (err) {
      message.error("Something went wrong");
    }
  };

  return (
    <div>
      <PageToolbar
        title="Users"
        showSearch={true}
        onSearch={handleSearch}
        actions={[
          {
            label: "Add User",
            type: "primary",
            onClick: handleCreateUser // ✅ FIXED
          }
        ]}
      />

      {/* ✅ SINGLE TABLE ONLY */}
      <UserTable
        data={filteredUsers}
        loading={loading}
        onRowClick={handleEditUser} // 👈 EDIT on click
        onlineUsers={onlineUsers}
      />

      {/* 👁 DETAILS MODAL */}
      <Modal
        title="User Details"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        {selectedUser && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">
              {selectedUser.name}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {selectedUser.email}
            </Descriptions.Item>

            <Descriptions.Item label="Role">
              {selectedUser.role?.name || selectedUser.role || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Team">
              {selectedUser.team?.name || selectedUser.team || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="User ID">
              {selectedUser._id}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 🚀 DRAWER (CREATE + EDIT) */}
      <AppDrawer
        title={editingUser ? "Edit User" : "Create User"}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingUser(null);
        }}
      >
        <UserForm
          initialValues={editingUser}
          onSubmit={handleSubmit}
        />
      </AppDrawer>
    </div>
  );
}

export default Users;