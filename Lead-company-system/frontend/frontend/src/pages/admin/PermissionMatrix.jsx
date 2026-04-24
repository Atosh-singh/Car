import { Table, Select, Tag, Button, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchRoles, updateRole } from "../../redux/slices/roleSlice";

function PermissionMatrix() {
  const dispatch = useDispatch();

  const { roles } = useSelector((state) => state.roles);

  const [localRoles, setLocalRoles] = useState([]);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    setLocalRoles(roles || []);
  }, [roles]);

  // ✅ HANDLE SCOPE CHANGE
  const handleScopeChange = (roleId, value) => {
    setLocalRoles((prev) =>
      prev.map((role) =>
        role._id === roleId ? { ...role, dataScope: value } : role
      )
    );
  };

  // ✅ SAVE CHANGES
  const handleSave = async () => {
    try {
      for (const role of localRoles) {
        await dispatch(
          updateRole({
            id: role._id,
            roleData: { dataScope: role.dataScope }
          })
        ).unwrap();
      }

      message.success("Roles updated successfully");
    } catch (err) {
      message.error("Failed to update roles");
    }
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      render: (name) => <Tag color="blue">{name}</Tag>
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (desc) => desc || "-"
    },
    {
      title: "Data Scope",
      render: (_, role) => (
        <Select
          value={role.dataScope || "OWN"}
          style={{ width: 160 }}
          onChange={(value) => handleScopeChange(role._id, value)}
          options={[
            { value: "OWN", label: "Own Leads" },
            { value: "TEAM", label: "Team Leads" },
            { value: "MULTI_TEAM", label: "Multiple Teams" },
            { value: "ALL", label: "All Data" }
          ]}
        />
      )
    }
  ];

  return (
    <div>
      {/* SAVE BUTTON */}
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Button type="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={localRoles}
        rowKey="_id"
        pagination={false}
      />
    </div>
  );
}

export default PermissionMatrix;