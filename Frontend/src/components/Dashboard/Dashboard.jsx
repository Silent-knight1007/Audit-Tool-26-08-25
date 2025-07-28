import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, Label, LabelList,
  PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Pie chart colors for Minor, Major, Observation
const PIE_COLORS = [
  '#2b72b8',  // Minor - blue
  '#e94560',  // Major - red
  '#ffd460'   // Observation - yellow
];

export default function Dashboard() {
  const [auditData, setAuditData] = useState([]);
  const [plannedAuditData, setPlannedAuditData] = useState([]);
  const [plannedVsExecutedData, setPlannedVsExecutedData] = useState([]);
  const [nonConformities, setNonConformities] = useState([]);
  const [ncDropdown, setNcDropdown] = useState('all');
  const [ncYears, setNcYears] = useState([]);
  const [pieData, setPieData] = useState([
    { name: 'Minor', value: 0 },
    { name: 'Major', value: 0 },
    { name: 'Observation', value: 0 }
  ]);
  const navigate = useNavigate();

  // Fetch audit data once, also extract nonConformities from audits (adjust if nonConformities come from elsewhere)
  useEffect(() => {
    async function fetchAudits() {
      try {
        const response = await axios.get('http://localhost:5000/api/AuditPlan');
        setAuditData(response.data);

        let ncs = [];
        response.data.forEach(audit => {
          if (audit.nonConformities) {
            ncs = ncs.concat(audit.nonConformities);
          }
        });
        setNonConformities(ncs);
      } catch (err) {
        console.error('Error fetching audits', err);
      }
    }
    fetchAudits();
  }, []);

  // Process data for first chart: Planned Audits by Internal/External
  useEffect(() => {
    const countsByYear = {};
    auditData.forEach(audit => {
      if (audit.status === 'Planned') {
        const year = new Date(audit.plannedDate).getFullYear();
        if (!countsByYear[year]) countsByYear[year] = { internal: 0, external: 0 };
        if (audit.auditType?.toLowerCase() === 'internal') countsByYear[year].internal += 1;
        else if (audit.auditType?.toLowerCase() === 'external') countsByYear[year].external += 1;
      }
    });
    const processed = Object.keys(countsByYear)
      .sort()
      .map(year => ({
        year,
        internal: countsByYear[year].internal,
        external: countsByYear[year].external,
      }));
    setPlannedAuditData(processed);
  }, [auditData]);

  // Process data for second chart: Planned vs Executed Audits stacked bar with 2 bars per year
  useEffect(() => {
    const countsByYear = {};
    auditData.forEach(audit => {
      const year = new Date(audit.plannedDate).getFullYear();
      if (!countsByYear[year]) countsByYear[year] = {
        plannedInternal: 0,
        plannedExternal: 0,
        executedInternal: 0,
        executedExternal: 0
      };
      if (audit.status === 'Planned') {
        if (audit.auditType?.toLowerCase() === 'internal') countsByYear[year].plannedInternal += 1;
        else if (audit.auditType?.toLowerCase() === 'external') countsByYear[year].plannedExternal += 1;
      } else if (audit.status === 'Executed' || audit.status === 'Completed') {
        if (audit.auditType?.toLowerCase() === 'internal') countsByYear[year].executedInternal += 1;
        else if (audit.auditType?.toLowerCase() === 'external') countsByYear[year].executedExternal += 1;
      }
    });
    const processed = Object.keys(countsByYear)
      .sort()
      .map(year => ({
        year,
        plannedInternal: countsByYear[year].plannedInternal,
        plannedExternal: countsByYear[year].plannedExternal,
        executedInternal: countsByYear[year].executedInternal,
        executedExternal: countsByYear[year].executedExternal,
      }));
    setPlannedVsExecutedData(processed);
  }, [auditData]);

  // Extract unique years from nonConformities data
  useEffect(() => {
    if (!nonConformities.length) {
      setNcYears([]);
      return;
    }
    const yearsSet = new Set();
    nonConformities.forEach(nc => {
      let yr;
      if (nc.date) {
        yr = new Date(nc.date).getFullYear();
      } else if (nc.year) {
        yr = Number(nc.year);
      }
      if (yr) yearsSet.add(yr);
    });
    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a); // descending order
    setNcYears(sortedYears);
  }, [nonConformities]);

  // Update pie data based on dropdown selection, with safety replacement for zero values
  useEffect(() => {
    if (!nonConformities.length) {
      setPieData([
        { name: 'Minor', value: 0 },
        { name: 'Major', value: 0 },
        { name: 'Observation', value: 0 }
      ]);
      return;
    }
    let filtered = nonConformities;
    if (ncDropdown !== 'all') {
      filtered = nonConformities.filter(nc => {
        let yr;
        if (nc.date) {
          yr = new Date(nc.date).getFullYear().toString();
        } else if (nc.year) {
          yr = nc.year.toString();
        }
        return yr === ncDropdown;
      });
    }
    const counts = { Minor: 0, Major: 0, Observation: 0 };
    filtered.forEach(nc => {
      const cat = (nc.category || '').trim().toLowerCase();
      if (cat === 'minor') counts.Minor += 1;
      else if (cat === 'major') counts.Major += 1;
      else if (cat === 'observation') counts.Observation += 1;
    });
    setPieData([
      { name: 'Minor', value: counts.Minor },
      { name: 'Major', value: counts.Major },
      { name: 'Observation', value: counts.Observation }
    ]);
  }, [nonConformities, ncDropdown]);

  // Handler when clicking bars, capitalizing type and navigating
  const handleBarClick = (data, type) => {
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    navigate('/AuditPlan', { state: { year: data.year, type: capitalizedType } });
  };

  // Animation variants for consistent UI
  const headingVariant = {
    hidden: { opacity: 0, x: -60, scale: 0.6 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 80, delay: 0.1 } }
  };
  const subheadingVariant = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, delay: 0.5 } }
  };
  const chartContainerVariant = {
    hidden: { opacity: 0, scale: 0.7, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 80, delay: 0.9 } }
  };

  // Custom two-line legend for Planned vs Executed stacked graph
  const CustomLegend = () => (
    <div className="text-center mb-6 select-none">
      <div className="flex justify-center gap-8 mb-1">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#C9184A' }}></span>
          <span className="font-semibold text-red-700">Planned Internal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#FF758F' }}></span>
          <span className="font-semibold text-red-700">Planned External</span>
        </div>
      </div>
      <div className="flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#C9184A' }}></span>
          <span className="font-semibold text-red-700">Executed Internal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#FF758F' }}></span>
          <span className="font-semibold text-red-700">Executed External</span>
        </div>
      </div>
    </div>
  );

  // Safe pie data with minimal dummy values to ensure rendering slices
  const safePieData = pieData.map(d => ({
    ...d,
    value: d.value === 0 ? 0.1 : d.value
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="py-16 bg-white min-h-screen"
    >
      <div className="container mx-auto px-4 md:px-10 text-gray-700">
        {/* Main Heading */}
        <motion.h1
          className="text-4xl font-bold mb-10 text-center"
          variants={headingVariant}
          initial="hidden"
          animate="visible"
        >
          Welcome to Onxtel Dashboard
        </motion.h1>

        {/* Bar Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Bar Chart Card */}
          <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col">
            <motion.h2
              className="text-2xl font-semibold mb-6 text-center"
              variants={subheadingVariant}
              initial="hidden"
              animate="visible"
            >
              Planned Audits
            </motion.h2>
            <motion.div
              className="w-full h-96"
              variants={chartContainerVariant}
              initial="hidden"
              animate="visible"
            >
              <ResponsiveContainer>
                <BarChart
                  data={plannedAuditData}
                  margin={{ top: 10, right: 40, left: 20, bottom: 80 }}
                  barCategoryGap="20%"
                  barGap={10}
                >
                  <XAxis dataKey="year" tick={{ fontSize: 14, fill: '#b91010ff' }}>
                    <Label
                      value="YEAR"
                      offset={-35}
                      position="insideBottom"
                      style={{ fontWeight: 'bold', fontSize: 16 }}
                    />
                  </XAxis>
                  <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#b91010ff' }}>
                    <Label
                      angle={-90}
                      position="insideLeft"
                      value="COUNT"
                      offset={10}
                      style={{ textAnchor: 'middle', fontWeight: 'bold', fontSize: 16 }}
                    />
                  </YAxis>
                  <Tooltip />
                  <Legend
                    verticalAlign="top"
                    height={10}
                    formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                  />
                  <Bar
                    dataKey="internal"
                    fill="#e5464bff"
                    onClick={(data) => handleBarClick(data.payload, 'internal')}
                    cursor="pointer"
                  >
                    <LabelList dataKey="internal" position="top" style={{ fill: '#e5464bff', fontWeight: 'bold' }} />
                  </Bar>
                  <Bar
                    dataKey="external"
                    fill="#b91010ff"
                    onClick={(data) => handleBarClick(data.payload, 'external')}
                    cursor="pointer"
                  >
                    <LabelList dataKey="external" position="top" style={{ fill: '#b91010ff', fontWeight: 'bold' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Second Bar Chart Card */}
          <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col">
            <motion.h2
              className="text-2xl font-semibold mb-2 text-center"
              variants={subheadingVariant}
              initial="hidden"
              animate="visible"
            >
              Planned vs Executed Audits
            </motion.h2>
            <CustomLegend />
            <motion.div
              className="w-full h-96"
              variants={chartContainerVariant}
              initial="hidden"
              animate="visible"
            >
              <ResponsiveContainer>
                <BarChart
                  data={plannedVsExecutedData}
                  margin={{ top: 10, right: 40, left: 20, bottom: 80 }}
                  barCategoryGap="65%"
                  barGap={10}
                >
                  <XAxis dataKey="year" tick={{ fontSize: 14, fill: '#b91010ff' }}>
                    <Label
                      value="YEAR"
                      offset={-35}
                      position="insideBottom"
                      style={{ fontWeight: 'bold', fontSize: 16 }}
                    />
                  </XAxis>
                  <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#b91010ff' }}>
                    <Label
                      angle={-90}
                      position="insideLeft"
                      value="COUNT"
                      offset={10}
                      style={{ textAnchor: 'middle', fontWeight: 'bold', fontSize: 16 }}
                    />
                  </YAxis>
                  <Tooltip />
                  <Bar
                    dataKey="plannedInternal"
                    stackId="planned"
                    fill="#C9184A"
                    onClick={(data) => handleBarClick(data.payload, 'Planned Internal')}
                    cursor="pointer"
                    name="Planned Internal"
                  >
                    <LabelList dataKey="plannedInternal" position="top" style={{ fill: '#C9184A', fontWeight: 'bold' }} />
                  </Bar>
                  <Bar
                    dataKey="plannedExternal"
                    stackId="planned"
                    fill="#FF758F"
                    onClick={(data) => handleBarClick(data.payload, 'Planned External')}
                    cursor="pointer"
                    name="Planned External"
                  >
                    <LabelList dataKey="plannedExternal" position="top" style={{ fill: '#C9184A', fontWeight: 'bold' }} />
                  </Bar>
                  <Bar
                    dataKey="executedInternal"
                    stackId="executed"
                    fill="#C9184A"
                    onClick={(data) => handleBarClick(data.payload, 'Executed Internal')}
                    cursor="pointer"
                    name="Executed Internal"
                  >
                    <LabelList dataKey="executedInternal" position="top" style={{ fill: '#FF758F', fontWeight: 'bold' }} />
                  </Bar>
                  <Bar
                    dataKey="executedExternal"
                    stackId="executed"
                    fill="#FF758F"
                    onClick={(data) => handleBarClick(data.payload, 'Executed External')}
                    cursor="pointer"
                    name="Executed External"
                  >
                    <LabelList dataKey="executedExternal" position="top" style={{ fill: '#FF758F', fontWeight: 'bold' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>

        {/* Nonconformity Pie Chart Section */}
        <div className="mt-12">
          <motion.h2
            className="text-2xl font-semibold mb-3 text-center"
            variants={headingVariant}
            initial="hidden"
            animate="visible"
          >
            Nonconformity Breakdown
          </motion.h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <select
              className="border rounded px-4 py-2"
              value={ncDropdown}
              onChange={e => setNcDropdown(e.target.value)}
              aria-label="Filter Nonconformities by Year or All"
            >
              <option value="all">All Nonconformities</option>
              {ncYears.map(year =>
                <option value={year} key={year}>{year}</option>
              )}
            </select>
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center"
              style={{ width: 360, height: 360, boxShadow: '0 8px 32px rgba(44, 62, 80,0.15)' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safePieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => value > 0 ? `${name}: ${Math.round(value)}` : ''}
                    isAnimationActive={true}
                    stroke="#333"
                    strokeWidth={2}
                  >
                    {safePieData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        style={{
                          filter: 'drop-shadow(0px 7px 6px rgba(0,0,0,0.15))'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${Math.round(value)}`, name]} />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom Legend */}
              <div className="flex gap-6 mt-4">
                {safePieData.map((d, idx) => (
                  <div key={d.name} className="flex items-center space-x-2">
                    <span
                      className="inline-block w-5 h-5 rounded"
                      style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }}
                    ></span>
                    <span className="text-sm font-semibold">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Optionally, add a table or link pie slices to update content here */}
        </div>
      </div>
    </motion.div>
  );
}




























// import React, { useEffect, useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   ResponsiveContainer, Legend, Label, LabelList
// } from 'recharts';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function Dashboard() {
//   const [auditData, setAuditData] = useState([]);
//   const [plannedAuditData, setPlannedAuditData] = useState([]);
//   const [plannedVsExecutedData, setPlannedVsExecutedData] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchAudits() {
//       try {
//         const response = await axios.get('http://localhost:5000/api/AuditPlan');
//         setAuditData(response.data);
//       } catch (err) {
//         console.error('Error fetching audits', err);
//       }
//     }
//     fetchAudits();
//   }, []);

//   useEffect(() => {
//     const countsByYear = {};
//     auditData.forEach(audit => {
//       if (audit.status === 'Planned') {
//         const year = new Date(audit.plannedDate).getFullYear();
//         if (!countsByYear[year]) countsByYear[year] = { internal: 0, external: 0 };
//         if (audit.auditType?.toLowerCase() === 'internal') countsByYear[year].internal += 1;
//         else if (audit.auditType?.toLowerCase() === 'external') countsByYear[year].external += 1;
//       }
//     });
//     const processed = Object.keys(countsByYear)
//       .sort()
//       .map(year => ({
//         year,
//         internal: countsByYear[year].internal,
//         external: countsByYear[year].external,
//       }));
//     setPlannedAuditData(processed);
//   }, [auditData]);

//   useEffect(() => {
//     const countsByYear = {};
//     auditData.forEach(audit => {
//       const year = new Date(audit.plannedDate).getFullYear();
//       if (!countsByYear[year]) countsByYear[year] = {
//         plannedInternal: 0,
//         plannedExternal: 0,
//         executedInternal: 0,
//         executedExternal: 0
//       };
//       if (audit.status === 'Planned') {
//         if (audit.auditType?.toLowerCase() === 'internal') countsByYear[year].plannedInternal += 1;
//         else if (audit.auditType?.toLowerCase() === 'external') countsByYear[year].plannedExternal += 1;
//       } else if (audit.status === 'Executed' || audit.status === 'Completed') {
//         if (audit.auditType?.toLowerCase() === 'internal') countsByYear[year].executedInternal += 1;
//         else if (audit.auditType?.toLowerCase() === 'external') countsByYear[year].executedExternal += 1;
//       }
//     });
//     const processed = Object.keys(countsByYear)
//       .sort()
//       .map(year => ({
//         year,
//         plannedInternal: countsByYear[year].plannedInternal,
//         plannedExternal: countsByYear[year].plannedExternal,
//         executedInternal: countsByYear[year].executedInternal,
//         executedExternal: countsByYear[year].executedExternal,
//       }));
//     setPlannedVsExecutedData(processed);
//   }, [auditData]);

//   const handleBarClick = (data, type) => {
//     const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
//     navigate('/AuditPlan', { state: { year: data.year, type: capitalizedType } });
//   };

//   // Animations
//   const headingVariant = {
//     hidden: { opacity: 0, x: -60, scale: 0.6 },
//     visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 80, delay: 0.1 } }
//   };
//   const subheadingVariant = {
//     hidden: { opacity: 0, x: 60 },
//     visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, delay: 0.5 } }
//   };
//   const chartContainerVariant = {
//     hidden: { opacity: 0, scale: 0.7, y: 50 },
//     visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 80, delay: 0.9 } }
//   };

//   // Custom legend, unchanged
//   const CustomLegend = () => (
//     <div className="text-center mb-6 select-none">
//       <div className="flex justify-center gap-8 mb-1">
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#C9184A' }}></span>
//           <span className="font-semibold text-red-700">Planned Internal</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#FF758F' }}></span>
//           <span className="font-semibold text-red-700">Planned External</span>
//         </div>
//       </div>
//       <div className="flex justify-center gap-8">
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#C9184A' }}></span>
//           <span className="font-semibold text-red-700">Executed Internal</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#FF758F' }}></span>
//           <span className="font-semibold text-red-700">Executed External</span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, ease: 'easeOut' }}
//       className="py-16 bg-white min-h-screen"
//     >
//       <div className="container mx-auto px-4 md:px-10">
//         {/* Heading */}
//         <motion.h1
//           className="text-4xl font-bold mb-10 text-center"
//           variants={headingVariant}
//           initial="hidden"
//           animate="visible"
//         >
//           Welcome to Onxtel Dashboard
//         </motion.h1>

//         {/* Responsive cards grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* First Chart Card */}
//           <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col">
//             <motion.h2
//               className="text-2xl font-semibold mb-6 text-center"
//               variants={subheadingVariant}
//               initial="hidden"
//               animate="visible"
//             >
//               Planned Audits
//             </motion.h2>
//             <motion.div
//               className="w-full h-96"
//               variants={chartContainerVariant}
//               initial="hidden"
//               animate="visible"
//             >
//               <ResponsiveContainer>
//                 <BarChart
//                   data={plannedAuditData}
//                   margin={{ top: 10, right: 40, left: 20, bottom: 80 }}
//                   barCategoryGap="20%"
//                   barGap={10}
//                 >
//                   <XAxis dataKey="year" tick={{ fontSize: 14, fill: '#b91010ff' }}>
//                     <Label
//                       value="YEAR"
//                       offset={-35}
//                       position="insideBottom"
//                       style={{ fontWeight: 'bold', fontSize: 16 }}
//                     />
//                   </XAxis>
//                   <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#b91010ff' }}>
//                     <Label
//                       angle={-90}
//                       position="insideLeft"
//                       value="COUNT"
//                       offset={10}
//                       style={{ textAnchor: 'middle', fontWeight: 'bold', fontSize: 16 }}
//                     />
//                   </YAxis>
//                   <Tooltip />
//                   <Legend
//                     verticalAlign="top"
//                     height={10}
//                     formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
//                   />
//                   <Bar
//                     dataKey="internal"
//                     fill="#e5464bff"
//                     onClick={(data) => handleBarClick(data.payload, 'internal')}
//                     cursor="pointer"
//                   >
//                     <LabelList dataKey="internal" position="top" style={{ fill: '#e5464bff', fontWeight: 'bold' }} />
//                   </Bar>
//                   <Bar
//                     dataKey="external"
//                     fill="#b91010ff"
//                     onClick={(data) => handleBarClick(data.payload, 'external')}
//                     cursor="pointer"
//                   >
//                     <LabelList dataKey="external" position="top" style={{ fill: '#b91010ff', fontWeight: 'bold' }} />
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </motion.div>
//           </div>

//           {/* Second Chart Card */}
//           <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col">
//             <motion.h2
//               className="text-2xl font-semibold mb-2 text-center"
//               variants={subheadingVariant}
//               initial="hidden"
//               animate="visible"
//             >
//               Planned vs Executed Audits
//             </motion.h2>
//             <CustomLegend />

//             <motion.div
//               className="w-full h-96"
//               variants={chartContainerVariant}
//               initial="hidden"
//               animate="visible"
//             >
//               <ResponsiveContainer>
//                 <BarChart
//                   data={plannedVsExecutedData}
//                   margin={{ top: 10, right: 40, left: 20, bottom: 80 }}
//                   barCategoryGap="65%"
//                   barGap={10}
//                 >
//                   <XAxis dataKey="year" tick={{ fontSize: 14, fill: '#b91010ff' }}>
//                     <Label
//                       value="YEAR"
//                       offset={-35}
//                       position="insideBottom"
//                       style={{ fontWeight: 'bold', fontSize: 16 }}
//                     />
//                   </XAxis>
//                   <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#b91010ff' }}>
//                     <Label
//                       angle={-90}
//                       position="insideLeft"
//                       value="COUNT"
//                       offset={10}
//                       style={{ textAnchor: 'middle', fontWeight: 'bold', fontSize: 16 }}
//                     />
//                   </YAxis>
//                   <Tooltip />
//                   {/* Bar for Planned auditing (stacked internal+external) */}
//                   <Bar
//                     dataKey="plannedInternal"
//                     stackId="planned"
//                     fill="#C9184A"
//                     onClick={(data) => handleBarClick(data.payload, 'Planned Internal')}
//                     cursor="pointer"
//                     name="Planned Internal"
//                   >
//                     <LabelList dataKey="plannedInternal" position="top" style={{ fill: '#C9184A', fontWeight: 'bold' }} />
//                   </Bar>
//                   <Bar
//                     dataKey="plannedExternal"
//                     stackId="planned"
//                     fill="#FF758F"
//                     onClick={(data) => handleBarClick(data.payload, 'Planned External')}
//                     cursor="pointer"
//                     name="Planned External"
//                   >
//                     <LabelList dataKey="plannedExternal" position="top" style={{ fill: '#C9184A', fontWeight: 'bold' }} />
//                   </Bar>
//                   {/* Bar for Executed auditing (stacked internal+external) */}
//                   <Bar
//                     dataKey="executedInternal"
//                     stackId="executed"
//                     fill="#C9184A"
//                     onClick={(data) => handleBarClick(data.payload, 'Executed Internal')}
//                     cursor="pointer"
//                     name="Executed Internal"
//                   >
//                     <LabelList dataKey="executedInternal" position="top" style={{ fill: '#FF758F', fontWeight: 'bold' }} />
//                   </Bar>
//                   <Bar
//                     dataKey="executedExternal"
//                     stackId="executed"
//                     fill="#FF758F"
//                     onClick={(data) => handleBarClick(data.payload, 'Executed External')}
//                     cursor="pointer"
//                     name="Executed External"
//                   >
//                     <LabelList dataKey="executedExternal" position="top" style={{ fill: '#FF758F', fontWeight: 'bold' }} />
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

















// new
// import React, { useEffect, useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   ResponsiveContainer, Legend, Label, LabelList
// } from 'recharts';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function Dashboard() {
//   const [auditData, setAuditData] = useState([]);
//   const [plannedAuditData, setPlannedAuditData] = useState([]);
//   const [plannedVsExecutedData, setPlannedVsExecutedData] = useState([]);
//   const navigate = useNavigate();

//   // Fetch audit data once
//   useEffect(() => {
//     async function fetchAudits() {
//       try {
//         const response = await axios.get('http://localhost:5000/api/AuditPlan');
//         setAuditData(response.data);
//       } catch (err) {
//         console.error('Error fetching audits', err);
//       }
//     }
//     fetchAudits();
//   }, []);

//   // Process data for first chart: Planned Audits by Internal/External
//   useEffect(() => {
//     const countsByYear = {};
//     auditData.forEach(audit => {
//       if (audit.status === 'Planned') {
//         const year = new Date(audit.plannedDate).getFullYear();
//         if (!countsByYear[year]) countsByYear[year] = { internal: 0, external: 0 };
//         if (audit.auditType?.toLowerCase() === 'internal') countsByYear[year].internal += 1;
//         else if (audit.auditType?.toLowerCase() === 'external') countsByYear[year].external += 1;
//       }
//     });
//     const processed = Object.keys(countsByYear)
//       .sort()
//       .map(year => ({
//         year,
//         internal: countsByYear[year].internal,
//         external: countsByYear[year].external,
//       }));
//     setPlannedAuditData(processed);
//   }, [auditData]);

//   // Process data for second chart: Planned vs Executed Audits stacked bar with 2 bars per year
//   useEffect(() => {
//     const countsByYear = {};
//     auditData.forEach(audit => {
//       const year = new Date(audit.plannedDate).getFullYear();
//       if (!countsByYear[year]) countsByYear[year] = {
//         plannedInternal: 0,
//         plannedExternal: 0,
//         executedInternal: 0,
//         executedExternal: 0
//       };
//       if (audit.status === 'Planned') {
//         if (audit.auditType?.toLowerCase() === 'internal') countsByYear[year].plannedInternal += 1;
//         else if (audit.auditType?.toLowerCase() === 'external') countsByYear[year].plannedExternal += 1;
//       } else if (audit.status === 'Executed' || audit.status === 'Completed') {
//         if (audit.auditType?.toLowerCase() === 'internal') countsByYear[year].executedInternal += 1;
//         else if (audit.auditType?.toLowerCase() === 'external') countsByYear[year].executedExternal += 1;
//       }
//     });
//     const processed = Object.keys(countsByYear)
//       .sort()
//       .map(year => ({
//         year,
//         // Combine for stacking grouped into two bars (planned and executed)
//         plannedInternal: countsByYear[year].plannedInternal,
//         plannedExternal: countsByYear[year].plannedExternal,
//         executedInternal: countsByYear[year].executedInternal,
//         executedExternal: countsByYear[year].executedExternal,
//       }));
//     setPlannedVsExecutedData(processed);
//   }, [auditData]);

//   // Click handler capitalizing type and navigating
//   const handleBarClick = (data, type) => {
//     const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
//     navigate('/AuditPlan', { state: { year: data.year, type: capitalizedType } });
//   };

//   // Animation variants for consistent UI
//   const headingVariant = {
//     hidden: { opacity: 0, x: -60, scale: 0.6 },
//     visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 80, delay: 0.1 } }
//   };
//   const subheadingVariant = {
//     hidden: { opacity: 0, x: 60 },
//     visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, delay: 0.5 } }
//   };
//   const chartContainerVariant = {
//     hidden: { opacity: 0, scale: 0.7, y: 50 },
//     visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 80, delay: 0.9 } }
//   };

//   // Custom two-line legend for Planned vs Executed stacked graph
//   const CustomLegend = () => (
//     <div className="text-center mb-6 select-none">
//       <div className="flex justify-center gap-8 mb-1">
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#C9184A' }}></span>
//           <span className="font-semibold text-red-700">Planned Internal</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#FF758F' }}></span>
//           <span className="font-semibold text-red-700">Planned External</span>
//         </div>
//       </div>
//       <div className="flex justify-center gap-8">
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#C9184A' }}></span>
//           <span className="font-semibold text-red-700">Executed Internal</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#FF758F' }}></span>
//           <span className="font-semibold text-red-700">Executed External</span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, ease: 'easeOut' }}
//       className="py-16 bg-white min-h-screen"
//     >
//       <div className="container mx-auto px-6 text-gray-700 md:px-12 xl:px-6">

//         {/* Main Heading */}
//         <motion.h1
//           className="text-4xl font-bold mb-10 text-center"
//           variants={headingVariant}
//           initial="hidden"
//           animate="visible"
//         >
//           Welcome to Onxtel Dashboard
//         </motion.h1>
//         <div className="flex flex-col md:flex-row gap-10">
//         {/* First Graph - Planned Audits (Unchanged) */}
//         <div className="flex-1 flex flex-col">
//         <motion.h2
//           className="text-2xl font-semibold mb-6 text-center"
//           variants={subheadingVariant}
//           initial="hidden"
//           animate="visible"
//         >
//           Planned Audits
//         </motion.h2>
//         <motion.div
//           className="w-full h-96 mb-16"
//           variants={chartContainerVariant}
//           initial="hidden"
//           animate="visible"
//         >
//           <ResponsiveContainer>
//             <BarChart
//               data={plannedAuditData}
//               margin={{ top: 10, right: 40, left: 20, bottom: 80 }}
//               barCategoryGap="20%"
//               barGap={10}
//             >
//               <XAxis dataKey="year" tick={{ fontSize: 14, fill: '#b91010ff' }}>
//                 <Label
//                   value="YEAR"
//                   offset={-35}
//                   position="insideBottom"
//                   style={{ fontWeight: 'bold', fontSize: 16 }}
//                 />
//               </XAxis>
//               <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#b91010ff' }}>
//                 <Label
//                   angle={-90}
//                   position="insideLeft"
//                   value="COUNT"
//                   offset={10}
//                   style={{ textAnchor: 'middle', fontWeight: 'bold', fontSize: 16 }}
//                 />
//               </YAxis>
//               <Tooltip />
//               <Legend
//                 verticalAlign="top"
//                 height={10}
//                 formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
//               />
//               <Bar
//                 dataKey="internal"
//                 fill="#e5464bff"
//                 onClick={(data) => handleBarClick(data.payload, 'internal')}
//                 cursor="pointer"
//               >
//                 <LabelList dataKey="internal" position="top" style={{ fill: '#e5464bff', fontWeight: 'bold' }} />
//               </Bar>
//               <Bar
//                 dataKey="external"
//                 fill="#b91010ff"
//                 onClick={(data) => handleBarClick(data.payload, 'external')}
//                 cursor="pointer"
//               >
//                 <LabelList dataKey="external" position="top" style={{ fill: '#b91010ff', fontWeight: 'bold' }} />
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>
//         </div>

//         {/* Second Graph - Planned vs Executed (Stacked Bar, 2 bars per year) */}
//         <div className="flex-1 flex flex-col">
//         <motion.h2
//           className="text-m font-semibold mb-2 text-center"
//           variants={subheadingVariant}
//           initial="hidden"
//           animate="visible"
//         >
//           Planned vs Executed Audits
//         </motion.h2>
        
//         {/* Custom Legend */}
//         <CustomLegend />

//         <motion.div
//           className="w-full h-96"
//           variants={chartContainerVariant}
//           initial="hidden"
//           animate="visible"
//         >
//           <ResponsiveContainer>
//             <BarChart
//               data={plannedVsExecutedData}
//               margin={{ top: 10, right: 40, left: 20, bottom: 80 }}
//               barCategoryGap="65%"  // More gap between two bars (planned and executed)
//               barGap={10}
//             >
//               <XAxis dataKey="year" tick={{ fontSize: 14, fill: '#b91010ff' }}>
//                 <Label
//                   value="YEAR"
//                   offset={-35}
//                   position="insideBottom"
//                   style={{ fontWeight: 'bold', fontSize: 16 }}
//                 />
//               </XAxis>
//               <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#b91010ff' }}>
//                 <Label
//                   angle={-90}
//                   position="insideLeft"
//                   value="COUNT"
//                   offset={10}
//                   style={{ textAnchor: 'middle', fontWeight: 'bold', fontSize: 16 }}
//                 />
//               </YAxis>
//               <Tooltip />

//               {/* Bar for Planned auditing (stacked internal+external) */}
//               <Bar
//                 dataKey="plannedInternal"
//                 stackId="planned"
//                 fill="#C9184A"
//                 onClick={(data) => handleBarClick(data.payload, 'Planned Internal')}
//                 cursor="pointer"
//                 name="Planned Internal"
//               >
//                 <LabelList dataKey="plannedInternal" position="top" style={{ fill: '#C9184A', fontWeight: 'bold' }} />
//               </Bar>
//               <Bar
//                 dataKey="plannedExternal"
//                 stackId="planned"
//                 fill="#FF758F"
//                 onClick={(data) => handleBarClick(data.payload, 'Planned External')}
//                 cursor="pointer"
//                 name="Planned External"
//               >
//                 <LabelList dataKey="plannedExternal" position="top" style={{ fill: '#C9184A', fontWeight: 'bold' }} />
//               </Bar>

//               {/* Bar for Executed auditing (stacked internal+external) */}
//               <Bar
//                 dataKey="executedInternal"
//                 stackId="executed"
//                 fill="#C9184A"
//                 onClick={(data) => handleBarClick(data.payload, 'Executed Internal')}
//                 cursor="pointer"
//                 name="Executed Internal"
//               >
//                 <LabelList dataKey="executedInternal" position="top" style={{ fill: '#FF758F', fontWeight: 'bold' }} />
//               </Bar>
//               <Bar
//                 dataKey="executedExternal"
//                 stackId="executed"
//                 fill="#FF758F"
//                 onClick={(data) => handleBarClick(data.payload, 'Executed External')}
//                 cursor="pointer"
//                 name="Executed External"
//               >
//                 <LabelList dataKey="executedExternal" position="top" style={{ fill: '#FF758F', fontWeight: 'bold' }} />
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>
//         </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }















//old
// import React, { useEffect, useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   ResponsiveContainer, Legend, Label, LabelList
// } from 'recharts';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function Dashboard() {
//   const [auditData, setAuditData] = useState([]);
//   const [plannedAuditData, setPlannedAuditData] = useState([]);
//   const [plannedVsExecutedData, setPlannedVsExecutedData] = useState([]);
//   const navigate = useNavigate();

//   // Fetch audit data once
//   useEffect(() => {
//     async function fetchAudits() {
//       try {
//         const response = await axios.get('http://localhost:5000/api/AuditPlan');
//         setAuditData(response.data);
//       } catch (err) {
//         console.error('Error fetching audits', err);
//       }
//     }
//     fetchAudits();
//   }, []);

//   // Process data for first chart: Planned Audits by Internal/External
//   useEffect(() => {
//     const countsByYear = {};
//     auditData.forEach(audit => {
//       if (audit.status === 'Planned') {
//         const year = new Date(audit.plannedDate).getFullYear();
//         if (!countsByYear[year]) countsByYear[year] = { internal: 0, external: 0 };
//         if (audit.auditType?.toLowerCase() === 'internal') countsByYear[year].internal += 1;
//         else if (audit.auditType?.toLowerCase() === 'external') countsByYear[year].external += 1;
//       }
//     });
//     const processed = Object.keys(countsByYear)
//       .sort()
//       .map(year => ({
//         year,
//         internal: countsByYear[year].internal,
//         external: countsByYear[year].external,
//       }));
//     setPlannedAuditData(processed);
//   }, [auditData]);

//   // Process data for second chart: Planned vs Executed Audits by Internal/External
//   useEffect(() => {
//     const countsByYear = {};
//     auditData.forEach(audit => {
//       const year = new Date(audit.plannedDate).getFullYear();
//       if (!countsByYear[year]) countsByYear[year] = {
//         plannedInternal: 0,
//         executedInternal: 0,
//         plannedExternal: 0,
//         executedExternal: 0
//       };
//       if (audit.auditType?.toLowerCase() === 'internal') {
//         if (audit.status === 'Planned') countsByYear[year].plannedInternal += 1;
//         else if (audit.status === 'Executed' || audit.status === 'Completed') countsByYear[year].executedInternal += 1;
//       } else if (audit.auditType?.toLowerCase() === 'external') {
//         if (audit.status === 'Planned') countsByYear[year].plannedExternal += 1;
//         else if (audit.status === 'Executed' || audit.status === 'Completed') countsByYear[year].executedExternal += 1;
//       }
//     });
//     const processed = Object.keys(countsByYear)
//       .sort()
//       .map(year => ({
//         year,
//         plannedInternal: countsByYear[year].plannedInternal,
//         executedInternal: countsByYear[year].executedInternal,
//         plannedExternal: countsByYear[year].plannedExternal,
//         executedExternal: countsByYear[year].executedExternal,
//       }));
//     setPlannedVsExecutedData(processed);
//   }, [auditData]);

//   // Handle clicks on bars, capitalize type before navigation
//   const handleBarClick = (data, type) => {
//     const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
//     navigate('/AuditPlan', { state: { year: data.year, type: capitalizedType } });
//   };

//   // Animation variants
//   const headingVariant = {
//     hidden: { opacity: 0, x: -60, scale: 0.6 },
//     visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 80, delay: 0.1 } }
//   };
//   const subheadingVariant = {
//     hidden: { opacity: 0, x: 60 },
//     visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, delay: 0.5 } }
//   };
//   const chartContainerVariant = {
//     hidden: { opacity: 0, scale: 0.7, y: 50 },
//     visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 80, delay: 0.9 } }
//   };

//   // Custom two-line legend for Planned vs Executed graph
//   const CustomLegend = () => (
//     <div className="text-center mb-6 select-none">
//       <div className="flex justify-center gap-8 mb-1">
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#4F46E5' }}></span>
//           <span className="font-semibold text-gray-700">Planned Internal</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#10B981' }}></span>
//           <span className="font-semibold text-gray-700">Planned External</span>
//         </div>
//       </div>
//       <div className="flex justify-center gap-8">
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#3730A3' }}></span>
//           <span className="font-semibold text-gray-700">Executed Internal</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-5 h-5 inline-block rounded" style={{ backgroundColor: '#047857' }}></span>
//           <span className="font-semibold text-gray-700">Executed External</span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, ease: 'easeOut' }}
//       className="py-16 bg-white min-h-screen"
//     >
//       <div className="container mx-auto px-6 text-gray-700 md:px-12 xl:px-6">

//         {/* Main Heading */}
//         <motion.h1
//           className="text-4xl font-bold mb-10 text-center"
//           variants={headingVariant}
//           initial="hidden"
//           animate="visible"
//         >
//           Welcome to Onxtel Dashboard
//         </motion.h1>

//         {/* First Graph - Planned Audits */}
//         <motion.h2
//           className="text-2xl font-semibold mb-6 text-center"
//           variants={subheadingVariant}
//           initial="hidden"
//           animate="visible"
//         >
//           Planned Audits
//         </motion.h2>
//         <motion.div
//           className="w-full h-96 mb-16"
//           variants={chartContainerVariant}
//           initial="hidden"
//           animate="visible"
//         >
//           <ResponsiveContainer>
//             <BarChart
//               data={plannedAuditData}
//               margin={{ top: 40, right: 50, left: 0, bottom: 80 }}
//               barCategoryGap="25%"
//               barGap={20}
//             >
//               <XAxis dataKey="year" tick={{ fontSize: 14, fill: '#4B5563' }}>
//                 <Label
//                   value="Years"
//                   offset={-35}
//                   position="insideBottom"
//                   style={{ fontWeight: 'bold', fontSize: 16 }}
//                 />
//               </XAxis>
//               <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#4B5563' }}>
//                 <Label
//                   angle={-90}
//                   position="insideLeft"
//                   value="Count"
//                   offset={10}
//                   style={{ textAnchor: 'middle', fontWeight: 'bold', fontSize: 16 }}
//                 />
//               </YAxis>
//               <Tooltip />
//               <Legend
//                 verticalAlign="top"
//                 height={36}
//                 formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
//               />
//               <Bar
//                 dataKey="internal"
//                 fill="#e5464bff"
//                 onClick={(data) => handleBarClick(data.payload, 'internal')}
//                 cursor="pointer"
//               >
//                 <LabelList dataKey="internal" position="top" style={{ fill: '#e5464bff', fontWeight: 'bold' }} />
//               </Bar>
//               <Bar
//                 dataKey="external"
//                 fill="#b91010ff"
//                 onClick={(data) => handleBarClick(data.payload, 'external')}
//                 cursor="pointer"
//               >
//                 <LabelList dataKey="external" position="top" style={{ fill: '#b91010ff', fontWeight: 'bold' }} />
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>

//         {/* Second Graph - Planned vs Executed Audits */}
//         <motion.h2
//           className="text-2xl font-semibold mb-2 text-center"
//           variants={subheadingVariant}
//           initial="hidden"
//           animate="visible"
//         >
//           Planned vs Executed Audits
//         </motion.h2>

//         {/* Custom Two-Line Legend */}
//         <CustomLegend />

//         <motion.div
//           className="w-full h-96"
//           variants={chartContainerVariant}
//           initial="hidden"
//           animate="visible"
//         >
//           <ResponsiveContainer>
//             <BarChart
//               data={plannedVsExecutedData}
//               margin={{ top: 40, right: 40, left: 20, bottom: 80 }}
//               barCategoryGap="30%"
//               barGap={8}
//             >
//               <XAxis dataKey="year" tick={{ fontSize: 14, fill: '#4B5563' }}>
//                 <Label
//                   value="Years"
//                   offset={-35}
//                   position="insideBottom"
//                   style={{ fontWeight: 'bold', fontSize: 16 }}
//                 />
//               </XAxis>
//               <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#4B5563' }}>
//                 <Label
//                   angle={-90}
//                   position="insideLeft"
//                   value="Count"
//                   offset={10}
//                   style={{ textAnchor: 'middle', fontWeight: 'bold', fontSize: 16 }}
//                 />
//               </YAxis>
//               <Tooltip />

//               {/* Bars ordered as requested */}
//               <Bar
//                 dataKey="plannedInternal"
//                 fill="#C9184A"
//                 onClick={(data) => handleBarClick(data.payload, 'Planned Internal')}
//                 cursor="pointer"
//               >
//                 <LabelList dataKey="plannedInternal" position="top" style={{ fill: '#C9184A', fontWeight: 'bold' }} />
//               </Bar>
//               <Bar
//                 dataKey="plannedExternal"
//                 fill="#FF758F"
//                 onClick={(data) => handleBarClick(data.payload, 'Planned External')}
//                 cursor="pointer"
//               >
//                 <LabelList dataKey="plannedExternal" position="top" style={{ fill: '#10B981', fontWeight: 'bold' }} />
//               </Bar>
//               <Bar
//                 dataKey="executedInternal"
//                 fill="#F72C5B"
//                 onClick={(data) => handleBarClick(data.payload, 'Executed Internal')}
//                 cursor="pointer"
//               >
//                 <LabelList dataKey="executedInternal" position="top" style={{ fill: '#F72C5B', fontWeight: 'bold' }} />
//               </Bar>
//               <Bar
//                 dataKey="executedExternal"
//                 fill="#047857"
//                 onClick={(data) => handleBarClick(data.payload, 'Executed External')}
//                 cursor="pointer"
//               >
//                 <LabelList dataKey="executedExternal" position="top" style={{ fill: '#047857', fontWeight: 'bold' }} />
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }
