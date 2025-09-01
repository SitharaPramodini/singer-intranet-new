import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Users,
  Building,
  ChevronDown,
  X,
  Activity,
  AlertCircle,
} from "lucide-react";

const EventLog = () => {
  const [eventLogs, setEventLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown data
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [filters, setFilters] = useState({
    category: "",
    sub_category: "",
    service_ID: "",
    emp_ID: "",
    dep_ID: "",
    branch_ID: "",
    date: "",
    today: true, // default: today’s logs
  });

  const [dropdownStates, setDropdownStates] = useState({
    branch: { isOpen: false, searchTerm: "", filtered: [] },
    department: { isOpen: false, searchTerm: "", filtered: [] },
    category: { isOpen: false, searchTerm: "", filtered: [] },
    subCategory: { isOpen: false, searchTerm: "", filtered: [] },
    service: { isOpen: false, searchTerm: "", filtered: [] },
    employee: { isOpen: false, searchTerm: "", filtered: [] },
  });

  const toast = {
    error: (msg) => console.error("❌", msg),
    success: (msg) => console.log("✅", msg),
  };

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      const endpoints = [
        { key: "branches", url: "http://localhost:3000/api/employees/all-branches" },
        { key: "departments", url: "http://localhost:3000/api/employees/all-departments" },
        { key: "employees", url: "http://localhost:3000/api/employees/all-employees" },
        { key: "categories", url: "http://localhost:3000/api/admin/categories" },
        { key: "subCategories", url: "http://localhost:3000/api/admin/subcategories" },
        { key: "services", url: "http://localhost:3000/api/admin/services" },
      ];

      const results = await Promise.all(
        endpoints.map(async ({ key, url }) => {
          const res = await fetch(url);
          const data = await res.json();
          return { key, data: data || [] };
        })
      );

      results.forEach(({ key, data }) => {
        switch (key) {
          case "branches":
            setBranches(data);
            break;
          case "departments":
            setDepartments(data);
            break;
          case "employees":
            setEmployees(data);
            break;
          case "categories":
            setCategories(data);
            break;
          case "subCategories":
            setSubCategories(data);
            break;
          case "services":
            setServices(data);
            break;
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dropdown data");
    }
  };

  // Sync dropdown filtered data
  useEffect(() => {
    setDropdownStates((prev) => ({
      branch: { ...prev.branch, filtered: branches },
      department: { ...prev.department, filtered: departments },
      category: { ...prev.category, filtered: categories },
      subCategory: { ...prev.subCategory, filtered: subCategories },
      service: { ...prev.service, filtered: services },
      employee: { ...prev.employee, filtered: employees },
    }));
  }, [branches, departments, categories, subCategories, services, employees]);

  // Fetch event logs
  const fetchEventLogs = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:3000/api/admin/eventLog";

      if (filters.today) {
        url += "/today";
      } else if (filters.emp_ID) {
        url += `/user/${filters.emp_ID}`;
      } else if (filters.dep_ID) {
        url += `/department/${filters.dep_ID}`;
      } else if (filters.branch_ID) {
        url += `/branch/${filters.branch_ID}`;
      } else if (filters.date) {
        url += `/day/${filters.date}`;
      } else if (filters.category || filters.sub_category || filters.service_ID) {
        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.sub_category) params.append("sub_category", filters.sub_category);
        if (filters.service_ID) params.append("service_ID", filters.service_ID);
        url += `?${params.toString()}`;
      } else {
        url += "/all";
      }

      const res = await fetch(url);
      const data = await res.json();
      setEventLogs(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load event logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchEventLogs();
  }, [filters]);

  // Dropdown search
  const handleDropdownSearch = (type, searchTerm) => {
    const map = {
      branch: { data: branches, field: "branch_name" },
      department: { data: departments, field: "dep_name" },
      category: { data: categories, field: "category_name" },
      subCategory: { data: subCategories, field: "sub_category_name" },
      service: { data: services, field: "service_name" },
      employee: { data: employees, field: "emp_name" },
    };

    const { data, field } = map[type];
    const filtered = data.filter((item) =>
      item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setDropdownStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], searchTerm, filtered },
    }));
  };

  // Dropdown select
  const handleDropdownSelect = (type, value, id) => {
    const filterMap = {
      branch: "branch_ID",
      department: "dep_ID",
      employee: "emp_ID",
      service: "service_ID",
      category: "category",
      subCategory: "sub_category",
    };

    setFilters((prev) => ({ ...prev, [filterMap[type]]: id }));

    setDropdownStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], searchTerm: value, isOpen: false },
    }));
  };

  // Toggle dropdown
  const toggleDropdown = (type) => {
    setDropdownStates((prev) => {
      const updated = {};
      for (const key in prev) {
        updated[key] = { ...prev[key], isOpen: key === type ? !prev[key].isOpen : false };
      }
      return updated;
    });
  };

  // Clear filter
  const clearFilter = (type) => {
    const filterMap = {
      branch: "branch_ID",
      department: "dep_ID",
      employee: "emp_ID",
      service: "service_ID",
      category: "category",
      subCategory: "sub_category",
    };

    setFilters((prev) => ({ ...prev, [filterMap[type]]: "" }));
    setDropdownStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], searchTerm: "", isOpen: false },
    }));
  };

  // Handle other filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Reusable Dropdown
  const SearchableDropdown = ({ type, placeholder, icon: Icon }) => {
    const state = dropdownStates[type];
    return (
      <div className="relative">
        <div className="relative">
          <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={state.searchTerm}
            onChange={(e) => handleDropdownSearch(type, e.target.value)}
            onFocus={() => toggleDropdown(type)}
            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {state.searchTerm && (
            <button
              onClick={() => clearFilter(type)}
              className="absolute right-8 top-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown
            className={`absolute right-2 top-3 h-4 w-4 text-gray-400 transition-transform ${
              state.isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {state.isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {state.filtered.length > 0 ? (
              state.filtered.map((item) => (
                <div
                  key={item.id || item.name}
                  onClick={() =>
                    handleDropdownSelect(type, item.name || item.branch_name, item.id || item.branch_ID)
                  }
                  className="px-3 py-2 hover:bg-red-50 cursor-pointer text-sm"
                >
                  {item.branch_name || item.dep_name || item.emp_name || item.category_name || item.sub_category_name || item.service_name}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">No results found</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-4xl font-bold text-red-600 mb-6">Event Logs</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Filters</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <SearchableDropdown type="branch" placeholder="Select Branch..." icon={Building} />
            <SearchableDropdown type="department" placeholder="Select Department..." icon={Users} />
            <SearchableDropdown type="employee" placeholder="Select Employee..." icon={Users} />
            <SearchableDropdown type="category" placeholder="Select Category..." icon={Activity} />
            <SearchableDropdown type="subCategory" placeholder="Select Sub Category..." icon={Activity} />
            <SearchableDropdown type="service" placeholder="Select Service..." icon={Activity} />
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <input
                type="checkbox"
                name="today"
                id="today"
                checked={filters.today}
                onChange={handleFilterChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="today" className="text-sm font-medium text-red-700">
                Show Today Only
              </label>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading event logs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eventLogs.length > 0 ? (
                    eventLogs.map((log) => (
                      <tr key={log.event_ID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.event_ID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.sub_category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.service_ID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.emp_ID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.event_datetime).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={log.event}>
                          {log.event}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        No event logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventLog;
