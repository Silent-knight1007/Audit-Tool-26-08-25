import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// Dummy chart data
const data = [
  { name: 'Audit 1', uv: 400 },
  { name: 'Audit 2', uv: 300 },
  { name: 'Audit 3', uv: 200 },
  { name: 'Audit 4', uv: 278 },
  { name: 'Audit 5', uv: 189 },
];

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-16 bg-white"
    >
      <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
          <section id="dashboard" className="content-section box section-spacing">
            <div className="container">
              <h1 className="title font-bold">Welcome To Onextel Dashboard</h1>
            </div>
          </section>
          <div className="md:5/12 lg:w-5/12">
          </div>
        </div>
      </div>
    </motion.div>
  );
}









