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
              <h1 className="title">Welcome to Onextel Dashboard</h1>
            </div>
          </section>
          <div className="md:5/12 lg:w-5/12">
            {/* <img
                src="https://tailus.io/sources/blocks/left-image/preview/images/startup.png"
                alt="image"
            /> */}
          </div>
          <div className="md:7/12 lg:w-6/12">
            <h2 className="text-2xl text-gray-900 font-bold md:text-4xl">
              React development is carried out by passionate developers
            </h2>
            <p className="mt-6 text-gray-600">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum omnis voluptatem
              accusantium nemo perspiciatis delectus atque autem! Voluptatum tenetur beatae unde
              aperiam, repellat expedita consequatur! Officiis id consequatur atque doloremque!
            </p>
            <p className="mt-4 text-gray-600">
              Nobis minus voluptatibus pariatur dignissimos libero quaerat iure expedita at?
              Asperiores nemo possimus nesciunt dicta veniam aspernatur quam mollitia.
            </p>

            {/* Animated Bar Chart */}
            <div className="mt-10 bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Audit Overview</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="uv" fill="#f59e42" animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}




// import React from 'react'

// export default function Dashboard() {
//   return (
//       <div className="py-16 bg-white">
//           <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
//               <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
//                 <section id="dashboard" className="content-section box section-spacing">
//                    <div className="container">
//                         <h1 className="title">Welcome to Onextel Dashboard</h1>
//                     </div>
//                 </section> 
//                   <div className="md:5/12 lg:w-5/12">
//                       {/* <img
//                           src="https://tailus.io/sources/blocks/left-image/preview/images/startup.png"
//                           alt="image"
//                       /> */}
//                   </div>
//                   <div className="md:7/12 lg:w-6/12">
//                       <h2 className="text-2xl text-gray-900 font-bold md:text-4xl">
//                           React development is carried out by passionate developers
//                       </h2>
//                       <p className="mt-6 text-gray-600">
//                           Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum omnis voluptatem
//                           accusantium nemo perspiciatis delectus atque autem! Voluptatum tenetur beatae unde
//                           aperiam, repellat expedita consequatur! Officiis id consequatur atque doloremque!
//                       </p>
//                       <p className="mt-4 text-gray-600">
//                           Nobis minus voluptatibus pariatur dignissimos libero quaerat iure expedita at?
//                           Asperiores nemo possimus nesciunt dicta veniam aspernatur quam mollitia.
//                       </p>
//                   </div>
//               </div>
//           </div>
//       </div>
//   );
// }