import { useEffect, useState } from "react";
import { Modal, Descriptions, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AppDrawer from "../../components/common/AppDrawer";

import {
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam
} from "../../redux/slices/teamSlice";

import PageToolbar from "../../components/PageToolbar";
import TeamForm from "../../components/teams/TeamForm";
import TeamTable from "../../components/teams/TeamTable";

function Teams() {
  const dispatch = useDispatch();
  const { teams, loading } = useSelector((state) => state.teams);

  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
const [drawerTeam, setDrawerTeam] = useState(null);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  useEffect(() => {
    setFilteredTeams(teams);
  }, [teams]);

  const handleSearch = (value) => {
    const filtered = teams.filter((team) =>
      team.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTeams(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTeam(id)).unwrap();
      message.success("Team deleted");
    } catch (err) {
      message.error(err || "Delete failed");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTeam) {
        await dispatch(
          updateTeam({ id: editingTeam._id, teamData: values })
        ).unwrap();
        message.success("Team updated");
      } else {
        await dispatch(createTeam(values)).unwrap();
        message.success("Team created");
      }

      setFormOpen(false);
      setEditingTeam(null);
    } catch (err) {
      message.error(err || "Action failed");
    }
  };

  const handleRowClick = (record) => {
    setSelectedTeam(record);
    setDetailsOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingTeam(null);
    setFormOpen(true);
  };

  const handleOpenEditModal = (team) => {
    setEditingTeam(team);
    setFormOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormOpen(false);
    setEditingTeam(null);
  };

  const handleOpenDrawerCreate = () => {
  setDrawerTeam(null);
  setDrawerOpen(true);
};

const handleOpenDrawerEdit = (team) => {
  setDrawerTeam(team);
  setDrawerOpen(true);
};

const handleCloseDrawer = () => {
  setDrawerOpen(false);
  setDrawerTeam(null);
};

  return (
    <div>
      <PageToolbar
        title="Teams"
        showSearch={true}
        onSearch={handleSearch}
        actions={[
          {
            label: "Add Team",
            type: "primary",
            onClick: handleOpenDrawerCreate
          }
        ]}
      />

      <TeamTable
        data={filteredTeams}
        loading={loading}
        onRowClick={handleRowClick}
        onEdit={handleOpenDrawerEdit}
        onDelete={handleDelete}
      />

      <Modal
        title="Team Details"
        open={detailsOpen}
        onCancel={() => setDetailsOpen(false)}
        footer={null}
      >
        {selectedTeam && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Team Name">
              {selectedTeam.name}
            </Descriptions.Item>

            <Descriptions.Item label="Team Lead">
              {selectedTeam.lead?.name || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Total Members">
              {selectedTeam.members?.length || 0}
            </Descriptions.Item>

            <Descriptions.Item label="Team ID">
              {selectedTeam._id}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={editingTeam ? "Edit Team" : "Create Team"}
        open={formOpen}
        onCancel={handleCloseFormModal}
        footer={null}
        destroyOnClose
      >
        <TeamForm
          initialValues={editingTeam}
          onSubmit={handleSubmit}
        />
      </Modal>

      <AppDrawer
  title={drawerTeam ? "Edit Team" : "Create Team"}
  open={drawerOpen}
  onClose={handleCloseDrawer}
>
  <TeamForm
    initialValues={drawerTeam}
    onSubmit={async (values) => {
      await handleSubmit(values);
      handleCloseDrawer();
    }}
  />
</AppDrawer>
    </div>
  );
}

export default Teams;