import { Table, Button, Select, Tag, message } from "antd";
import API from "../api/axios";

function LeadTable({ leads, pagination, loading, setFilters }) {

  const handleStatusChange = async (value, record) => {
    try {

      await API.put(`/leads/${record._id}/status`, {
        status: value
      });

      message.success("Status updated");

      // reload leads
      setFilters(prev => ({
        ...prev
      }));

    } catch (error) {

      message.error("Failed to update status");

    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Phone",
      dataIndex: "phone"
    },
    {
      title: "Car",
      dataIndex: ["car", "name"]
    },
    {
      title: "Assigned To",
      dataIndex: ["assignedTo", "name"]
    },

    // ⭐ NEW STATUS COLUMN
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(value, record)}
        options={[
  { value: "New", label: "New" },
  { value: "Assigned", label: "Assigned" },
  { value: "Contacted", label: "Contacted" },
  { value: "Interested", label: "Interested" },
  { value: "FollowUp", label: "Follow Up" },
  { value: "TestDrive", label: "Test Drive" },
  { value: "Won", label: "Won" },
  { value: "Lost", label: "Lost" },
  { value: "Closed", label: "Closed" }
]}
        />
      )
    },

    {
      title: "Actions",
      render: () => (
        <>
          <Button type="link">Edit</Button>
          <Button danger type="link">Delete</Button>
        </>
      )
    }
  ];

  const handleTableChange = (pagination) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current
    }));
  };

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={leads}
      loading={loading}
      pagination={{
        total: pagination?.total || 0,
        pageSize: pagination?.limit || 10
      }}
      onChange={handleTableChange}
    />
  );
}

export default LeadTable;