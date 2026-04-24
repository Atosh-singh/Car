import { useEffect, useMemo, useState } from "react";
import { Modal, Descriptions, Tag, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole
} from "../../redux/slices/roleSlice";

import { fetchPermissions } from "../../redux/slices/permissionSlice";

import PageToolbar from "../../components/PageToolbar";
import RoleForm from "../../components/roles/RoleForm";
import RoleTable from "../../components/roles/RoleTable";
import AppDrawer from "../../components/common/AppDrawer";

function Roles() {
  const dispatch = useDispatch();

  const { roles, loading } = useSelector((state) => state.roles);
  const { permissions = [] } = useSelector((state) => state.permissions);

  const [filteredRoles, setFilteredRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
const [drawerRole, setDrawerRole] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    setFilteredRoles(roles || []);
  }, [roles]);

  const permissionMap = useMemo(() => {
    const map = {};
    permissions.forEach((permission) => {
      map[permission._id] = permission.name;
      map[permission.name] = permission.name;
    });
    return map;
  }, [permissions]);

  const resolvePermissionName = (value) => {
    return permissionMap[value] || value;
  };

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();

    const filtered = (roles || []).filter((role) =>
      role.name?.toLowerCase().includes(searchValue)
    );

    setFilteredRoles(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteRole(id)).unwrap();
      message.success("Role deleted");
    } catch (err) {
      message.error(err || "Delete failed");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRole) {
        // ⚠️ current backend updateRole expects permission NAMES
        const permissionNames = (values.permissions || []).map((id) => {
          const matchedPermission = permissions.find((p) => p._id === id);
          return matchedPermission ? matchedPermission.name : id;
        });

        const payload = {
          name: values.name,
          description: values.description || "",
          permissions: permissionNames
        };

        await dispatch(
          updateRole({
            id: editingRole._id,
            roleData: payload
          })
        ).unwrap();

        message.success("Role updated");
      } else {
        // ✅ current backend createRole expects permission IDS
        const payload = {
          name: values.name,
          description: values.description || "",
          permissions: values.permissions || []
        };

        await dispatch(createRole(payload)).unwrap();
        message.success("Role created");
      }

      setFormOpen(false);
      setEditingRole(null);
    } catch (err) {
      message.error(err || "Action failed");
    }
  };

  const handleRowClick = (record) => {
    setSelectedRole(record);
    setDetailsOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingRole(null);
    setFormOpen(true);
  };

  const handleOpenEditModal = (role) => {
    setEditingRole(role);
    setFormOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormOpen(false);
    setEditingRole(null);
  };

  const handleOpenDrawerCreate = () => {
  setDrawerRole(null);
  setDrawerOpen(true);
};

const handleOpenDrawerEdit = (role) => {
  setDrawerRole(role);
  setDrawerOpen(true);
};

const handleCloseDrawer = () => {
  setDrawerOpen(false);
  setDrawerRole(null);
};

  return (
    <div>
      <PageToolbar
        title="Roles"
        showSearch={true}
        onSearch={handleSearch}
        actions={[
          {
            label: "Add Role",
            type: "primary",
            onClick: handleOpenDrawerCreate
          }
        ]}
      />

      <RoleTable
        data={filteredRoles}
        loading={loading}
        onRowClick={handleRowClick}
        onEdit={ handleOpenDrawerCreate}
        onDelete={handleDelete}
        resolvePermissionName={resolvePermissionName}
      />

      <Modal
        title="Role Details"
        open={detailsOpen}
        onCancel={() => setDetailsOpen(false)}
        footer={null}
      >
        {selectedRole && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Role Name">
              {selectedRole.name}
            </Descriptions.Item>

            <Descriptions.Item label="Description">
              {selectedRole.description || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Permissions">
              {selectedRole.permissions?.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selectedRole.permissions.map((permission, index) => (
                    <Tag key={`${permission}-${index}`}>
                      {resolvePermissionName(permission)}
                    </Tag>
                  ))}
                </div>
              ) : (
                "-"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              {selectedRole.enabled ? "Enabled" : "Disabled"}
            </Descriptions.Item>

            <Descriptions.Item label="Role ID">
              {selectedRole._id}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={editingRole ? "Edit Role" : "Create Role"}
        open={formOpen}
        onCancel={handleCloseFormModal}
        footer={null}
        destroyOnClose
      >
        <RoleForm
          initialValues={editingRole}
          permissions={permissions}
          onSubmit={handleSubmit}
        />
      </Modal>

<AppDrawer
  title={drawerRole ? "Edit Role" : "Create Role"}
  open={drawerOpen}
  onClose={handleCloseDrawer}
>
  <RoleForm
    initialValues={drawerRole}
    permissions={permissions}
    onSubmit={async (values) => {
      await handleSubmit(values);
      handleCloseDrawer();
    }}
  />
</AppDrawer>

    </div>
  );
}

export default Roles;