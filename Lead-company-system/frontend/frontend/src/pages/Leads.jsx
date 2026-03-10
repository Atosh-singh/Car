import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads } from "../redux/slices/leadSlice";
import LeadTable from "../components/LeadTable";
import LeadFilters from "../components/LeadFilters";

function Leads() {

  const dispatch = useDispatch();
  const { leads, pagination, loading } = useSelector((state) => state.leads);

const [filters, setFilters] = useState({
  page: 1,
  limit: 10,
  search: ""
});

useEffect(() => {
  dispatch(fetchLeads(filters));
}, [filters]);

  return (
    <div>

      <LeadFilters filters={filters} setFilters={setFilters} />

      <LeadTable
        leads={leads}
        pagination={pagination}
        loading={loading}
        setFilters={setFilters}
      />

    </div>
  );
}

export default Leads;