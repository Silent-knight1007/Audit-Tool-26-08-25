import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PIE_COLORS = [
  "#2b72b8", // Minor
  "#e94560", // Major
  "#ffd460", // Observation
];

const COLORS = {
  plannedInternal: "#1560bd",
  plannedExternal: "#90caf9",
  executedInternal: "#ef6c00",
  executedExternal: "#ffd180",
};

const DEPARTMENTS = [
  "IT",
  "HR",
  "Compliance",
  "Operations",
  "Quality Assurance",
  "Finance",
];

export default function Dashboard() {
  const [auditData, setAuditData] = useState([]);
  const [plannedVsExecutedData, setPlannedVsExecutedData] = useState([]);

  const [nonconformities, setNonconformities] = useState([]);

  // General Nonconformity Dropdown
  const [ncDropdown, setNcDropdown] = useState("all");
  const [ncYears, setNcYears] = useState([]);
  const [pieData, setPieData] = useState([
    { name: "Minor", value: 0 },
    { name: "Major", value: 0 },
    { name: "Observation", value: 0 },
  ]);

  // Open Nonconformity Dropdown and Data
  const [openNcDropdown, setOpenNcDropdown] = useState("all");
  const [openNcYears, setOpenNcYears] = useState([]);
  const [openPieData, setOpenPieData] = useState([
    { name: "Minor", value: 0 },
    { name: "Major", value: 0 },
    { name: "Observation", value: 0 },
  ]);
  const [deptOpenNcDropdown, setDeptOpenNcDropdown] = useState("all");
  const [deptOpenNcYears, setDeptOpenNcYears] = useState([]);
  const [deptOpenBarData, setDeptOpenBarData] = useState(
    DEPARTMENTS.map((d) => ({ department: d, count: 0 }))
  );

  // Closed Nonconformities Dropdown and Data
  const [closedNcDropdown, setClosedNcDropdown] = useState("all");
  const [closedNcYears, setClosedNcYears] = useState([]);
  const [closedPieData, setClosedPieData] = useState([
    { name: "Minor", value: 0 },
    { name: "Major", value: 0 },
    { name: "Observation", value: 0 },
  ]);
  const [closedDeptDropdown, setClosedDeptDropdown] = useState("all");
  const [closedDeptYears, setClosedDeptYears] = useState([]);
  const [closedDeptBarData, setClosedDeptBarData] = useState(
    DEPARTMENTS.map((d) => ({ department: d, count: 0 }))
  );

  const navigate = useNavigate();

  // Fetch audits
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/AuditPlan")
      .then((res) => setAuditData(res.data || []))
      .catch((e) => console.error("Audit fetch error", e));
  }, []);

  // Process audits to bar chart data
  useEffect(() => {
    const countsByYear = {};
    auditData.forEach((audit) => {
      if (!audit.plannedDate) return;
      const y = new Date(audit.plannedDate).getFullYear();
      if (!countsByYear[y]) {
        countsByYear[y] = {
          plannedInternal: 0,
          plannedExternal: 0,
          executedInternal: 0,
          executedExternal: 0,
        };
      }
      const type = (audit.auditType || "").toLowerCase();
      if (audit.status === "Planned") {
        if (type === "internal") countsByYear[y].plannedInternal++;
        else if (type === "external") countsByYear[y].plannedExternal++;
      } else if (audit.status === "Executed" || audit.status === "Completed") {
        if (type === "internal") countsByYear[y].executedInternal++;
        else if (type === "external") countsByYear[y].executedExternal++;
      }
    });
    const processed = Object.entries(countsByYear)
      .sort(([a], [b]) => a - b)
      .map(([year, data]) => ({
        year,
        ...data,
      }));
    setPlannedVsExecutedData(processed);
  }, [auditData]);

  // Fetch nonconformities
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/Nonconformity")
      .then((res) => setNonconformities(res.data || []))
      .catch((e) => console.error("Nonconformity fetch error", e));
  }, []);

  // Extract dropdown years for general NCs
  useEffect(() => {
    if (!nonconformities.length) {
      setNcYears([]);
      return;
    }
    const setYears = new Set();
    nonconformities.forEach((nc) => {
      let y = nc.reportingDate
        ? new Date(nc.reportingDate).getFullYear()
        : nc.year;
      if (y) setYears.add(String(y));
    });
    setNcYears([...setYears].sort((a, b) => b - a));
  }, [nonconformities]);

  // General NC pie data update
  useEffect(() => {
    if (!nonconformities.length) {
      setPieData([
        { name: "Minor", value: 0 },
        { name: "Major", value: 0 },
        { name: "Observation", value: 0 },
      ]);
      return;
    }
    const filtered =
      ncDropdown === "all"
        ? nonconformities
        : nonconformities.filter((nc) => {
            let y = nc.reportingDate
              ? new Date(nc.reportingDate).getFullYear()
              : nc.year;
            return String(y) === ncDropdown;
          });
    const counts = { minor: 0, major: 0, observation: 0 };
    filtered.forEach((nc) => {
      const t = (nc.ncType || "").toLowerCase();
      if (t === "minor") counts.minor++;
      else if (t === "major") counts.major++;
      else if (t === "observation") counts.observation++;
    });
    setPieData([
      { name: "Minor", value: counts.minor },
      { name: "Major", value: counts.major },
      { name: "Observation", value: counts.observation },
    ]);
  }, [nonconformities, ncDropdown]);

  // Open NC years
  useEffect(() => {
    if (!nonconformities.length) {
      setOpenNcYears([]);
      return;
    }
    const ySet = new Set();
    nonconformities.forEach((nc) => {
      if (
        nc.ncstatus &&
        nc.ncstatus.toLowerCase() === "open"
      ) {
        let y = nc.reportingDate
          ? new Date(nc.reportingDate).getFullYear()
          : nc.year;
        if (y) ySet.add(String(y));
      }
    });
    setOpenNcYears([...ySet].sort((a, b) => b - a));
  }, [nonconformities]);

  // Open NC pie data
  useEffect(() => {
    if (!nonconformities.length) {
      setOpenPieData([
        { name: "Minor", value: 0 },
        { name: "Major", value: 0 },
        { name: "Observation", value: 0 },
      ]);
      return;
    }
    const filtered = nonconformities.filter((nc) => {
      return (
        nc.ncstatus &&
        nc.ncstatus.toLowerCase() === "open" &&
        (openNcDropdown === "all" ||
          String(
            nc.reportingDate
              ? new Date(nc.reportingDate).getFullYear()
              : nc.year
          ) === openNcDropdown)
      );
    });
    const counts = { minor: 0, major: 0, observation: 0 };
    filtered.forEach((nc) => {
      const t = (nc.ncType || "").toLowerCase();
      if (t === "minor") counts.minor++;
      else if (t === "major") counts.major++;
      else if (t === "observation") counts.observation++;
    });
    setOpenPieData([
      { name: "Minor", value: counts.minor },
      { name: "Major", value: counts.major },
      { name: "Observation", value: counts.observation },
    ]);
  }, [nonconformities, openNcDropdown]);

  // Open NC dept years
  useEffect(() => {
    if (!nonconformities.length) {
      setDeptOpenNcYears([]);
      return;
    }
    const ySet = new Set();
    nonconformities.forEach((nc) => {
      if (
        nc.ncstatus &&
        nc.ncstatus.toLowerCase() === "open"
      ) {
        let y = nc.reportingDate
          ? new Date(nc.reportingDate).getFullYear()
          : nc.year;
        if (y) ySet.add(String(y));
      }
    });
    setDeptOpenNcYears([...ySet].sort((a, b) => b - a));
  }, [nonconformities]);

  // Open NC dept bar chart data
  useEffect(() => {
    if (!nonconformities.length) {
      setDeptOpenBarData(DEPARTMENTS.map((d) => ({ department: d, count: 0 })));
      return;
    }
    const filtered = nonconformities.filter((nc) => {
      return (
        nc.ncstatus &&
        nc.ncstatus.toLowerCase() === "open" &&
        (deptOpenNcDropdown === "all" ||
          String(
            nc.reportingDate
              ? new Date(nc.reportingDate).getFullYear()
              : nc.year
          ) === deptOpenNcDropdown)
      );
    });
    const counts = {};
    DEPARTMENTS.forEach((d) => (counts[d] = 0));
    filtered.forEach((nc) => {
      const d = (nc.department || "").trim();
      if (DEPARTMENTS.includes(d)) counts[d]++;
    });
    setDeptOpenBarData(
      DEPARTMENTS.map((d) => ({ department: d, count: counts[d] || 0 }))
    );
  }, [nonconformities, deptOpenNcDropdown]);

  // Closed NC years
  useEffect(() => {
    if (!nonconformities.length) {
      setClosedNcYears([]);
      return;
    }
    const ySet = new Set();
    nonconformities.forEach((nc) => {
      if (
        nc.ncstatus &&
        nc.ncstatus.toLowerCase() === "closed"
      ) {
        let y = nc.reportingDate
          ? new Date(nc.reportingDate).getFullYear()
          : nc.year;
        if (y) ySet.add(String(y));
      }
    });
    setClosedNcYears([...ySet].sort((a, b) => b - a));
  }, [nonconformities]);

  // Closed NC pie data
  useEffect(() => {
    if (!nonconformities.length) {
      setClosedPieData([
        { name: "Minor", value: 0 },
        { name: "Major", value: 0 },
        { name: "Observation", value: 0 },
      ]);
      return;
    }
    const filtered = nonconformities.filter((nc) => {
      return (
        nc.ncstatus &&
        nc.ncstatus.toLowerCase() === "closed" &&
        (closedNcDropdown === "all" ||
          String(
            nc.reportingDate ? new Date(nc.reportingDate).getFullYear() : nc.year
          ) === closedNcDropdown)
      );
    });
    const counts = { minor: 0, major: 0, observation: 0 };
    filtered.forEach((nc) => {
      const t = (nc.ncType || "").toLowerCase();
      if (t === "minor") counts.minor++;
      else if (t === "major") counts.major++;
      else if (t === "observation") counts.observation++;
    });
    setClosedPieData([
      { name: "Minor", value: counts.minor },
      { name: "Major", value: counts.major },
      { name: "Observation", value: counts.observation },
    ]);
  }, [nonconformities, closedNcDropdown]);

  // Closed NC dept years
  useEffect(() => {
    if (!nonconformities.length) {
      setClosedDeptYears([]);
      return;
    }
    const ySet = new Set();
    nonconformities.forEach((nc) => {
      if (
        nc.ncstatus &&
        nc.ncstatus.toLowerCase() === "closed"
      ) {
        let y = nc.reportingDate
          ? new Date(nc.reportingDate).getFullYear()
          : nc.year;
        if (y) ySet.add(String(y));
      }
    });
    setClosedDeptYears([...ySet].sort((a, b) => b - a));
  }, [nonconformities]);

  // Closed NC dept bar chart data
  useEffect(() => {
    if (!nonconformities.length) {
      setClosedDeptBarData(DEPARTMENTS.map((d) => ({ department: d, count: 0 })));
      return;
    }
    const filtered = nonconformities.filter((nc) => {
      return (
        nc.ncstatus &&
        nc.ncstatus.toLowerCase() === "closed" &&
        (closedDeptDropdown === "all" ||
          String(
            nc.reportingDate
              ? new Date(nc.reportingDate).getFullYear()
              : nc.year
          ) === closedDeptDropdown)
      );
    });
    const counts = {};
    DEPARTMENTS.forEach((d) => (counts[d] = 0));
    filtered.forEach((nc) => {
      const d = (nc.department || "").trim();
      if (DEPARTMENTS.includes(d)) counts[d]++;
    });
    setClosedDeptBarData(
      DEPARTMENTS.map((d) => ({ department: d, count: counts[d] || 0 }))
    );
  }, [nonconformities, closedDeptDropdown]);

  // Navigation handlers
  const navigateToAuditPlan = (year, type) => {
    navigate("/AuditPlan", { state: { year, type } });
  };
  const handlePieClick = (category) => {
    navigate("/Nonconformity", {
      state: { category, year: ncDropdown === "all" ? null : ncDropdown },
    });
  };
  const handleOpenPieClick = (category) => {
    navigate("/Nonconformity", {
      state: { category, year: openNcDropdown === "all" ? null : openNcDropdown },
    });
  };
  const handleClosedPieClick = (category) => {
    navigate("/Nonconformity", {
      state: { category, year: closedNcDropdown === "all" ? null : closedNcDropdown },
    });
  };

  // Animations
  const headingVariant = {
    hidden: { opacity: 0, x: -60, scale: 0.6 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 80, delay: 0.1 } },
  };
  const subheadingVariant = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, delay: 0.5 } },
  };
  const chartVariant = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80, delay: 0.9 } },
  };

  // safe pie data for zero slices
  const safePieData = pieData.map((d) => ({
    ...d,
    value: d.value === 0 ? 0.1 : d.value,
  }));

  const safeOpenPieData = openPieData.map((d) => ({
    ...d,
    value: d.value === 0 ? 0.1 : d.value,
  }));

  const safeClosedPieData = closedPieData.map((d) => ({
    ...d,
    value: d.value === 0 ? 0.1 : d.value,
  }));

  return (
    <motion.div
      className="py-16 bg-red-500 min-h-screen"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 md:px-10 text-gray-700">
        {/* Dashboard title
        <motion.h1 className="text-4xl font-bold mb-10 text-center" variants={headingVariant} initial="hidden" animate="visible">
          Dashboard
        </motion.h1> */}

        {/* First row */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Planned vs Executed audits */}
          <div className="bg-white rounded-xl shadow-xl p-5 flex-1 min-w-0">
            <motion.h2 className="text-2xl font-semibold mb-4 text-center" variants={subheadingVariant} initial="hidden" animate="visible">
              Planned Audits Vs Executed Audits
            </motion.h2>
            <motion.div className="w-full h-96" variants={chartVariant} initial="hidden" animate="visible">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={plannedVsExecutedData} margin={{ top: 10, right: 40, left: 10, bottom: 50 }}>
                  <XAxis dataKey="year" axisLine tick={{ fontSize: 14, fill: "#222" }} style={{ fontWeight: "bold" }} label={{ value: "Year", position: "insideBottom", offset: -20, fontWeight: "bold", fontSize: 16, fill: "#555" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: "#222" }} label={{ value: "Count", angle: -90, position: "insideLeft", offset: 15, fontWeight: "bold", fontSize: 16, fill: "#555" }} />
                  <Tooltip formatter={(val, name) => [val, name.replace(/([A-Z])/g, " $1").trim()]} labelStyle={{ fontWeight: "bold" }} />
                  <Bar dataKey="plannedInternal" stackId="planned" fill={COLORS.plannedInternal} name="Planned Internal" barSize={26} cursor="pointer" onClick={(d) => navigateToAuditPlan(d.payload.year, "Planned Internal")} />
                  <Bar dataKey="plannedExternal" stackId="planned" fill={COLORS.plannedExternal} name="Planned External" barSize={26} cursor="pointer" onClick={(d) => navigateToAuditPlan(d.payload.year, "Planned External")} />
                  <Bar dataKey="executedInternal" stackId="executed" fill={COLORS.executedInternal} name="Executed Internal" barSize={26} cursor="pointer" onClick={(d) => navigateToAuditPlan(d.payload.year, "Executed Internal")} />
                  <Bar dataKey="executedExternal" stackId="executed" fill={COLORS.executedExternal} name="Executed External" barSize={26} cursor="pointer" onClick={(d) => navigateToAuditPlan(d.payload.year, "Executed External")} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Reported Nonconformities Pie Chart */}
          <div className="bg-white rounded-xl shadow-xl p-5 flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <motion.h2 className="text-2xl font-semibold">Reported Non-Conformities</motion.h2>
              <select className="border rounded px-2 py-1 text-sm min-w-0 max-w-[120px]" value={ncDropdown} onChange={(e) => setNcDropdown(e.target.value)} aria-label="Filter Reported Nonconformities">
                <option value="all">All Years</option>
                {ncYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <PieChart>
                <Pie
                  data={safePieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={6}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => (value > 0 ? `${name}: ${Math.round(value)}` : "")}
                  isAnimationActive
                  stroke="#333"
                  strokeWidth={2}
                  onClick={(data) => handlePieClick(data.name)}
                >
                  {safePieData.map((entry, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} style={{ cursor: "pointer" }} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second row */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Open Nonconformities Pie */}
          <div className="bg-white rounded-xl shadow-xl p-5 flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <motion.h2 className="text-2xl font-semibold">Open Non-Conformities</motion.h2>
              <select className="border rounded px-2 py-1 text-sm min-w-0 max-w-[120px]" value={openNcDropdown} onChange={(e) => setOpenNcDropdown(e.target.value)} aria-label="Filter Open Nonconformities">
                <option value="all">All Years</option>
                {openNcYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <PieChart>
                <Pie
                  data={safeOpenPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={6}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => (value > 0 ? `${name}: ${Math.round(value)}` : "")}
                  isAnimationActive
                  stroke="#333"
                  strokeWidth={2}
                  onClick={(data) => handleOpenPieClick(data.name)}
                >
                  {safeOpenPieData.map((entry, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} style={{ cursor: "pointer" }} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Open Nonconformities Bar Chart */}
          <div className="bg-white rounded-xl shadow-xl p-5 flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <motion.h2 className="text-2xl font-semibold">Open Non-Conformities by Department</motion.h2>
              <select className="border rounded px-2 py-1 text-sm min-w-0 max-w-[120px]" value={deptOpenNcDropdown} onChange={(e) => setDeptOpenNcDropdown(e.target.value)} aria-label="Filter Open Nonconformities by Department">
                <option value="all">All Years</option>
                {deptOpenNcYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={deptOpenBarData} margin={{ top: 10, right: 30, left: 20, bottom: 50 }}>
                <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: "#222" }} label={{ value: "Count", angle: -90, position: "insideLeft", offset: 15, fontWeight: "bold", fontSize: 16, fill: "#555" }} />
                <XAxis dataKey="department" tick={{ fontSize: 12, fill: "#222" }} interval={0} angle={-40} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#222" }} />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS.executedInternal} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Third row */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Closed Nonconformities Pie */}
          <div className="bg-white rounded-xl shadow-xl p-5 flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <motion.h2 className="text-2xl font-semibold">Closed Non-Conformities</motion.h2>
              <select className="border rounded px-2 py-1 text-sm min-w-0 max-w-[120px]" value={closedNcDropdown} onChange={(e) => setClosedNcDropdown(e.target.value)} aria-label="Filter Closed Nonconformities">
                <option value="all">All Years</option>
                {closedNcYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <PieChart>
                <Pie
                  data={safeClosedPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={6}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => (value > 0 ? `${name}: ${Math.round(value)}` : "")}
                  isAnimationActive
                  stroke="#333"
                  strokeWidth={2}
                  onClick={(data) => handleClosedPieClick(data.name)}
                >
                  {safeClosedPieData.map((entry, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} style={{ cursor: "pointer" }} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Closed Nonconformities Bar Chart */}
          <div className="bg-white rounded-xl shadow-xl p-5 flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <motion.h2 className="text-2xl font-semibold">Closed Non-Conformities by Department</motion.h2>
              <select className="border rounded px-2 py-1 text-sm min-w-0 max-w-[120px]" value={closedDeptDropdown} onChange={(e) => setClosedDeptDropdown(e.target.value)} aria-label="Filter Closed Nonconformities by Department">
                <option value="all">All Years</option>
                {closedDeptYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={closedDeptBarData} margin={{ top: 10, right: 30, left: 20, bottom: 50 }}>
                <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: "#222" }} label={{ value: "Count", angle: -90, position: "insideLeft", offset: 15, fontWeight: "bold", fontSize: 16, fill: "#555" }} />
                <XAxis dataKey="department" tick={{ fontSize: 12, fill: "#222" }} interval={0} angle={-40} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#222" }} />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS.plannedExternal} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
