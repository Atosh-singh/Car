import { Input } from "antd";

function LeadFilters({ filters, setFilters }) {

  const handleSearch = (e) => {

    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1
    }));

  };

  return (
    <Input.Search
      placeholder="Search leads..."
      onChange={handleSearch}
      style={{ width: 300 }}
    />
  );
}

export default LeadFilters;