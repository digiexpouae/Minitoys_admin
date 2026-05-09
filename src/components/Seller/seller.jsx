import React, { useEffect, useState } from 'react';
import AddSeller from './addSelller';
import Cookies from 'js-cookie'
import api from '../../api/axiosinterceptor';
import ENDPOINTS from '../../utils/ENDPOINTS';
import { useNavigate } from 'react-router';
import toast, { Toaster } from "react-hot-toast";

const ManageSeller = () => {

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSellers, setFilteredSellers] = useState()
  const statusOptions = ['All', 'Active', 'Pending', 'Suspended', 'InActive'];
  const navigate = useNavigate()
  // const filteredSellers = sellers.filter(seller =>
  //   seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  // );


  const [sellers, setSellers] = useState(null)
  const token = Cookies.get("adminToken")


  const applyFilters = (status, search) => {
    let filtered = [...sellers]

    if (status) {
      const sellerStatus = status.toLowerCase()
      filtered = filtered.filter((elem) =>
        elem.status == sellerStatus
      )
      setFilteredSellers(filtered)
    }
    console.log("filtered item", filtered)
    if (search) {
      const normalizedSearch = search.trim().toLowerCase()
      filtered = filtered.filter((elem) =>
        elem.name.trim().toLowerCase().includes(normalizedSearch)
      )
      setFilteredSellers(filtered)
    }
    console.log("filtered products", filtered)
    setFilteredSellers(filtered)
  }

  const handleSearchFilter = (e) => {
    const selectedSearch = e.target.value
    setSearchTerm(selectedSearch)
    applyFilters(filterStatus, selectedSearch)

  }
  const FetchSellers = async () => {
    const response = await api.get({
      url: `${ENDPOINTS.OTHER.USERS}/all`
    })
    setSellers(response.users)
  }
  useEffect(() => {
    if (token) {
      FetchSellers()
    }
  }, [])

  const handleStatusFilter = (e) => {
    const selectStatus = e.target.value
    setFilterStatus(selectStatus)
    applyFilters(selectStatus, searchTerm)
  };

  const handleUpdateCommission = (sellerId) => {
    // API call will be added here later
    console.log('Update commission for seller:', sellerId);
  };
  const handleEdit = async (id) => {
    console.log("Edit works")
    return navigate(`/update-seller/${id}`)
  }
  const handleDelete = async (id) => {
    try {
      const response = await api.delete({
        url: `${ENDPOINTS.OTHER.USERS}/${id}`
      });

      if (response.success) {
        setSellers((prev) => prev.filter((c) => c.id !== id));
        FetchSellers()
        toast.success("Seller deleted successfully");

      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete category");
      console.error("Delete Seller error:", error?.message);
    }
  };


  const Sellers = (filteredSellers && filteredSellers.length > 0 ? filteredSellers : sellers)


  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8 font-sans ">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">Manage Seller</h1>
              <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Update Seller
              </span>
            </div>
            {/* <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"

              onClick={() => { setIsModalOpen(true) }}
            >
              Add Seller
            </button> */}
          </div>

          {/* Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800">
              If you found commission not crediting using cron job you can update commission manually from here (click update)
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Filter By Status:</label>
                <select
                  value={filterStatus}
                  onChange={handleStatusFilter}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={handleSearchFilter}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sellers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th> */}
                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th> */}
                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th> */}
                    {/*  */}
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Sellers?.filter((seller) => seller.role == "vendor").map((seller) => (

                    <tr key={seller.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {seller.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {seller.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {seller.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                          {seller.status}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {seller.rating}
                      </td> */}
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {seller.rating}
                      </td> */}
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {seller.rating}
                      </td> */}
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {seller.rating}
                      </td> */}

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(seller.id)}
                          className="text-blue-600 hover:text-blue-900 font-medium transition-colors duration-200"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(seller.id)}
                          className="text-red-600 ml-3 hover:text-red-900 font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* {filteredSellers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No sellers found matching your criteria.</p>
          </div>
        )} */}
        </div>
        <Toaster position="bottom-right" reverseOrder={false} />


      </div>
      {isModalOpen && <div className='fixed inset-0 z-[99999] backdrop-blur-sm overflow-auto '><AddSeller isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /></div>}
    </>
    //  



  );
};

export default ManageSeller;