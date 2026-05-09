// import React, { useState } from 'react';
// import User from './user'
// import Department from './department'
// import Capex from './capexmain'
// import Vendor from './vendor'
// import Report from './report'
// import Capexcategories from './capexCategoriesmain';
// export default function DepartmentBudgets({user,fetchusers,departments,fetchcapexCategories,fetchDepartments,fetchVendor,fetchVendordata}) {
//    const [department, setDepartments] = useState([
//     {
//       id: 1,
//       name: 'Engineering',
//       costCenter: 'CC-001',
//       allocated: 50000,
//       spent: 32500,
//       forecast: 45000,
//       updated: '2025-11-15',
//     },
//     {
//   //     id: 2,
//   //     name: 'Marketing',
//   //     costCenter: 'CC-002',
//   //     allocated: 30000,
//   //     spent: 28000,
//   //     forecast: 29500,
//   //     updated: '2025-11-18',
//     },
//     {
//   //     id: 3,
//   //     name: 'Sales',
//   //     costCenter: 'CC-003',
//   //     allocated: 25000,
//   //     spent: 18750,
//   //     forecast: 23000,
//   //     updated: '2025-11-17',
//     },
//   ]);

//   const [activeTab, setActiveTab] = useState('budgets');

//   const tabs = [
//     { id: 'budgets', label: 'Budgets' },
//     { id: 'users', label: 'Users' },
//     { id: 'departments', label: 'Departments' },
//     { id: 'capex', label: 'Capex' },
//     { id: 'reports', label: 'Reports' },
//     { id: 'vendors', label: 'Vendors' },
//     {id:'capex categories',label:'Capex categories'}
//   ];

//   const totalBudget = department.reduce((sum, dept) => sum + dept.allocated, 0);
//   const totalSpent = department.reduce((sum, dept) => sum + dept.spent, 0);
//   const totalForecast = department.reduce((sum, dept) => sum + dept.forecast, 0);
//   const forecastRemaining = totalBudget - totalForecast;
//   const variance = ((totalForecast - totalBudget) / totalBudget) * 100;

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-GB', {
//       style: 'currency',
//       currency: 'GBP',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const calculatePercentUsed = (spent, allocated) => {
//     return ((spent / allocated) * 100).toFixed(1);
//   };

//   const calculateRemaining = (allocated, forecast) => {
//     return allocated - forecast;
//   };

//   return (
//     <div className=" relative rounded-lg bg-white text-black p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">Settings</h1>
//         <p className="text-black">Manage your FinOps system settings.</p>
//       </div>

//       {/* Tabs */}
//       <div className="border-b border-slate-800 mb-8">
//         <div className="flex gap-6">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`pb-3 px-1 font-medium transition-colors relative ${
//                 activeTab === tab.id
//                   ? 'text-blue-500'
//                   : 'text-black hover:text-slate-300'
//               }`}
//             >
//               {tab.label}
//               {activeTab === tab.id && (
//                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Tab Content */}
//       {activeTab === 'budgets' && (
//         <div>
//           {/* Department Budgets Title */}
//           <h2 className="text-2xl font-bold mb-6">Department Budgets</h2>

//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//             <div className="bg-white rounded-lg p-6 border border-slate-800">
//               <div className="text-black text-sm mb-2">TOTAL BUDGET</div>
//               <div className="text-3xl font-bold">{formatCurrency(totalBudget)}</div>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-slate-800">
//               <div className="text-black text-sm mb-2">SPEND TO DATE</div>
//               <div className="text-3xl font-bold">{formatCurrency(totalSpent)}</div>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-slate-800">
//               <div className="text-black text-sm mb-2">FORECAST REMAINING</div>
//               <div className="text-3xl font-bold">{formatCurrency(forecastRemaining)}</div>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-slate-800">
//               <div className="text-black text-sm mb-2">VARIANCE</div>
//               <div
//                 className={`text-3xl font-bold ${
//                   variance >= 0 ? 'text-green-500' : 'text-red-500'
//                 }`}
//               >
//                 {variance >= 0 ? '+' : ''}
//                 {variance.toFixed(0)}%
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="bg-white rounded-lg border border-slate-800 overflow-hidden">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-slate-800">
//                   <th className="text-left p-4 text-black font-medium">Department</th>
//                   <th className="text-left p-4 text-black font-medium">Cost Center</th>
//                   <th className="text-left p-4 text-black font-medium">Allocated</th>
//                   <th className="text-left p-4 text-black font-medium">Spent</th>
//                   <th className="text-left p-4 text-black font-medium">Forecast</th>
//                   <th className="text-left p-4 text-black font-medium">Remaining</th>
//                   <th className="text-left p-4 text-black font-medium">% Used</th>
//                   <th className="text-left p-4 text-black font-medium">Updated</th>
//                   <th className="text-left p-4 text-black font-medium">Edit</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {department.map((dept) => (
//                   <tr
//                     key={dept.id}
//                     className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
//                   >
//                     <td className="p-4 font-medium">{dept.name}</td>
//                     <td className="p-4 text-slate-300">{dept.costCenter}</td>
//                     <td className="p-4 text-slate-300">{formatCurrency(dept.allocated)}</td>
//                     <td className="p-4 text-slate-300">{formatCurrency(dept.spent)}</td>
//                     <td className="p-4 text-slate-300">{formatCurrency(dept.forecast)}</td>
//                     <td className="p-4 text-slate-300">
//                       {formatCurrency(calculateRemaining(dept.allocated, dept.forecast))}
//                     </td>
//                     <td className="p-4">
//                       <span
//                         className={`${
//                           parseFloat(calculatePercentUsed(dept.spent, dept.allocated)) > 90
//                             ? 'text-red-500'
//                             : parseFloat(calculatePercentUsed(dept.spent, dept.allocated)) > 75
//                             ? 'text-yellow-500'
//                             : 'text-green-500'
//                         }`}
//                       >
//                         {calculatePercentUsed(dept.spent, dept.allocated)}%
//                       </span>
//                     </td>
//                     <td className="p-4 text-slate-300">{dept.updated}</td>
//                     <td className="p-4">
//                       <button className="text-blue-500 hover:text-blue-400 transition-colors">
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
//                           />
//                         </svg>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Add Department Button */}
        
//         </div>
//       )}

//       {activeTab === 'users' && (
//         <div>
//           {/* Users UI */}
   
//           <User />
//         </div>
//       )}

//       {activeTab === 'departments' && (
//         <div className=' w-full'>      <Department   fetchusers={fetchusers} user={user} departments={departments}/></div>

//       )}

//       {activeTab === 'capex' && (
//         <div>
//           {/* Capex UI */}
//         <Capex fetchDepartments={fetchDepartments}  />
//         </div>
//       )}
//        {activeTab === 'capex categories' && (
//         <div>
//           {/* Capex UI */}
//         <Capexcategories fetchcapexCategories={fetchcapexCategories}/>
//         </div>
//       )}

//       {activeTab === 'reports' && (
//         <div>
//           {/* Reports UI */}
//           <h2 className="text-2xl font-bold mb-6">Reports</h2>
//           <Report />
//         </div>
//       )}

//       {activeTab === 'vendors' && (
//         <div>
//           {/* Vendors UI */}
//           <h2 className="text-2xl font-bold  px-8 py-4">Vendors</h2>
//           <Vendor fetchVendor={fetchVendor} fetchVendordata={fetchVendordata} />
//         </div>
//       )}
//     </div>
//   );
// }
