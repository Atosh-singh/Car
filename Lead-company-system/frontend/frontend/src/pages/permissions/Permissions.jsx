import { useEffect, useState } from "react";
import { Modal, Descriptions, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPermissions,
  createPermission,
  updatePermission,
  deletePermission
} from "../../redux/slices/permissionSlice";

import PageToolbar from "../../components/PageToolbar";
import PermissionForm from "../../components/permissions/PermissionForm";
import PermissionTable from "../../components/permissions/PermissionTable";
import AppDrawer from "../../components/common/AppDrawer";

function Permissions() {
  const dispatch = useDispatch();
  const { permissions, loading } = useSelector((state) => state.permissions);

  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
const [drawerPermission, setDrawerPermission] = useState(null);



  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    setFilteredPermissions(permissions || []);
  }, [permissions]);

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();

    const filtered = (permissions || []).filter((permission) =>
      permission.name?.toLowerCase().includes(searchValue)
    );

    setFilteredPermissions(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePermission(id)).unwrap();
      message.success("Permission deleted");
    } catch (err) {
      message.error(err || "Delete failed");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        description: values.description || ""
      };

      if (editingPermission) {
        await dispatch(
          updatePermission({
            id: editingPermission._id,
            permissionData: payload
          })
        ).unwrap();

        message.success("Permission updated");
      } else {
        await dispatch(createPermission(payload)).unwrap();
        message.success("Permission created");
      }

      setFormOpen(false);
      setEditingPermission(null);
    } catch (err) {
      message.error(err || "Action failed");
    }
  };

  const handleRowClick = (record) => {
    setSelectedPermission(record);
    setDetailsOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingPermission(null);
    setFormOpen(true);
  };

  const handleOpenEditModal = (permission) => {
    setEditingPermission(permission);
    setFormOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormOpen(false);
    setEditingPermission(null);
  };

  const handleOpenDrawerCreate = () => {
  setDrawerPermission(null);
  setDrawerOpen(true);
};

const handleOpenDrawerEdit = (permission) => {
  setDrawerPermission(permission);
  setDrawerOpen(true);
};

const handleCloseDrawer = () => {
  setDrawerOpen(false);
  setDrawerPermission(null);
};

  return (
    <div>
      <PageToolbar
        title="Permissions"
        showSearch={true}
        onSearch={handleSearch}
        actions={[
          {
            label: "Add Permission",
            type: "primary",
            onClick: handleOpenDrawerCreate
          }
        ]}
      />

      <PermissionTable
        data={filteredPermissions}
        loading={loading}
        onRowClick={handleRowClick}
        onEdit={handleOpenDrawerEdit}
        onDelete={handleDelete}
      />

      <Modal
        title="Permission Details"
        open={detailsOpen}
        onCancel={() => setDetailsOpen(false)}
        footer={null}
      >
        {selectedPermission && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Permission Name">
              {selectedPermission.name}
            </Descriptions.Item>

            <Descriptions.Item label="Description">
              {selectedPermission.description || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Permission ID">
              {selectedPermission._id}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={editingPermission ? "Edit Permission" : "Create Permission"}
        open={formOpen}
        onCancel={handleCloseFormModal}
        footer={null}
        destroyOnClose
      >
        <PermissionForm
          initialValues={editingPermission}
          onSubmit={handleSubmit}
        />
      </Modal>

      <AppDrawer
  title={drawerPermission ? "Edit Permission" : "Create Permission"}
  open={drawerOpen}
  onClose={handleCloseDrawer}
>
  <PermissionForm
    initialValues={drawerPermission}
    onSubmit={async (values) => {
      await handleSubmit(values);
      handleCloseDrawer();
    }}
  />
</AppDrawer>
    </div>
  );
}

export default Permissions;