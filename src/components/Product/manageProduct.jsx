import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ENDPOINTS from "../../utils/ENDPOINTS";
import Cookies from 'js-cookie'
import api from "../../api/axiosinterceptor";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { FetchCategory } from "../../services/categoriesService";



const categories = ["All", "Men Fashion", "Electronics", "Footwear", "Accessories", "Beauty"];
const statuses = ["All", "active", "inactive"];
const sellers = ["All", "Seller Store", "TechHub Store", "SportsZone", "LuxuryTime", "BeautyWorld"];

function StarRating({ rating, count }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {rating === 0 ? (
        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-medium">
          Not Rated
        </span>
      ) : (
        <span className="text-xs text-gray-500">({count} reviews)</span>
      )}
    </div>
  );
}

function ActionButtons({ product, onToggle, onDelete, onEdit }) {
  return (
    <div className="flex flex-col gap-1.5 items-center">
      {/* View */}
      {/* <button className="w-8 h-8 rounded bg-blue-700 hover:bg-blue-500 text-white flex items-center justify-center transition-colors duration-150" title="View"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button> */}
      {/* Edit */}
      <button className="w-8 h-8 rounded bg-blue-700 hover:bg-blue-500 text-white flex items-center justify-center transition-colors duration-150" title="Edit"

        onClick={() => onEdit(product.slug)}

      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      {/* Toggle Status */}
      {/* <button
        onClick={() => onToggle(product.id)}
        className={`w-8 h-8 rounded text-white flex items-center justify-center transition-colors duration-150 ${product.status === "active"
          ? "bg-yellow-500 hover:bg-yellow-400"
          : "bg-gray-400 hover:bg-gray-300"
          }`}
        title={product.status === "active" ? "Deactivate" : "Activate"}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      </button> */}
      {/* Delete */}
      <button
        onClick={() => onDelete(product.id)}
        className="w-8 h-8 rounded bg-red-600 hover:bg-red-400 text-white flex items-center justify-center transition-colors duration-150"
        title="Delete"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
      {/* Feature */}
      {/* <button className="w-8 h-8 rounded bg-blue-700 hover:bg-blue-500 text-white flex items-center justify-center transition-colors duration-150" title="Feature">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button> */}
      {/* Help / Info */}
      {/* <button className="w-8 h-8 rounded bg-teal-600 hover:bg-teal-400 text-white flex items-center justify-center transition-colors duration-150" title="Details">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button> */}
    </div>
  );
}

export default function ManageProducts() {

  const BASEURL = import.meta.env.VITE_BASEURL
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [category, setCategory] = useState([])
  const [filteredProducts, setFilteredProducts] = useState()
  const [sellerFilter, setSellerFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [Product, setProduct] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const token = Cookies.get("adminToken")

  const navigate = useNavigate()



  const FetchProducts = async () => {
    if (token) {
      const response = await api.get({
        url: `${ENDPOINTS.OTHER.PRODUCTS}/admin-products`
      })
      console.log("response", response)
      setProduct(response.products)

    }
  }
  const fetchCategoryNames = async () => {
    try {
      const response = await FetchCategory()
      console.log('category response', response)
      setCategory(response.categories)
    }
    catch (error) {
      // toast.error(error)
      console.log("error", error)
    }
  }

  const applyFilters = (category, search) => {
    let filtered = [...Product]

    if (category) {
      filtered = filtered.filter((elem) =>
        elem.category_id == category)


    }

    console.log("filtered item", filtered)
    if (search) {
      const normalizedSearch = search.trim().toLowerCase()
      filtered = filtered.filter((elem) =>
        elem.name.trim().toLowerCase().includes(normalizedSearch)
      )

    }
    console.log("filtered products", filtered)
    setFilteredProducts(filtered)
  }


  const handleCategoryFilter = (e) => {
    const selectCategory = e.target.value
    setCategoryFilter(selectCategory)
    applyFilters(selectCategory, search)
    console.log("selectcategory", selectCategory)
  }

  const handleSearchFilter = (e) => {
    const selectedSearch = e.target.value
    setSearch(selectedSearch)
    applyFilters(categoryFilter, selectedSearch)


  }




  useEffect(() => {

    FetchProducts()
    fetchCategoryNames()
  }, [])


  const totalPages = Math.ceil((Product?.length || 0) / itemsPerPage)
  const paginatedProducts = (filteredProducts && filteredProducts.length > 0)
    ? filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    : Product?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  useEffect(() => {
    console.log("filtered", filteredProducts)
    console.log("filtered", categoryFilter)
  }, [filteredProducts])


  const handleToggle = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
      )
    );
  };


  const handleDelete = async (id) => {
    try {
      const response = await api.delete({
        url: `${ENDPOINTS.OTHER.PRODUCTS}/${id}`
      });

      if (response.success) {
        setProduct((prev) => prev.filter((p) => p.id !== id));
        FetchProducts()
        toast.success("Product deleted successfully");
        setCurrentPage(1)
      }

    } catch (error) {
      toast.error(error?.response?.message || "Failed to delete Product");
      console.error("Delete Product error:", error?.message);
    }
  };

  const handleEdit = async (slug) => {
    console.log("Edit works")
    return navigate(`/update-product/${slug}`)
  }



  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // const filtered = products
  //   .filter((p) => {
  //     const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.seller.toLowerCase().includes(search.toLowerCase());
  //     const matchCat = categoryFilter === "All" || p.category === categoryFilter;
  //     const matchStatus = statusFilter === "All" || p.status === statusFilter;
  //     const matchSeller = sellerFilter === "All" || p.seller === sellerFilter;
  //     return matchSearch && matchCat && matchStatus && matchSeller;
  //   })
  //   .sort((a, b) => {
  //     if (!sortField) return 0;
  //     let va = a[sortField], vb = b[sortField];
  //     if (typeof va === "string") va = va.toLowerCase();
  //     if (typeof vb === "string") vb = vb.toLowerCase();
  //     if (va < vb) return sortDir === "asc" ? -1 : 1;
  //     if (va > vb) return sortDir === "asc" ? 1 : -1;
  //     return 0;
  //   });

  const SortIcon = ({ field }) => (
    <span className="ml-1 inline-flex flex-col leading-none">
      <svg className={`w-2.5 h-2.5 ${sortField === field && sortDir === "asc" ? "text-blue-700" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 10 6">
        <path d="M5 0L10 6H0z" />
      </svg>
      <svg className={`w-2.5 h-2.5 ${sortField === field && sortDir === "desc" ? "text-blue-700" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 10 6">
        <path d="M5 6L0 0H10z" />
      </svg>
    </span>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Products</h1>
        <nav className="text-sm text-gray-500 flex items-center gap-2">
          <a href="#" className="text-blue-700 hover:text-blue-500 font-medium transition-colors">Home</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">Products</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {/* Top bar */}
          <div className="flex justify-end px-6 pt-5 pb-4 border-b border-gray-100">
            <button
              onClick={() => navigate('/add-product')}
              className="bg-blue-700 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 flex flex-wrap gap-4 items-end border-b border-gray-100">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Filter By Product Category</label>
              <select
                value={categoryFilter}
                onChange={handleCategoryFilter}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="">Select Category</option>
                {category.map((c, i) => (
                  <option value={c.id} key={i}>{c === "All" ? "Select Categories" : c.name}</option>
                ))}
              </select>
            </div>
            {/* <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Filter By Product Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {statuses.map((s) => (
                  <option key={s}>{s === "All" ? "Select Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div> */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Filter By Seller</label>
              <select
                value={sellerFilter}
                onChange={(e) => setSellerFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {sellers.map((s) => (
                  <option key={s}>{s === "All" ? "Select a seller" : s}</option>
                ))}
              </select>
            </div>

            {/* Search + actions — right side */}
            <div className="ml-auto flex items-end gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={handleSearchFilter}
                  className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                </svg>
              </div>
              <button className="bg-gray-700 hover:bg-gray-500 text-white p-2.5 rounded-lg transition-colors" title="Refresh">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.13-3.36M20 15a9 9 0 01-14.13 3.36" />
                </svg>
              </button>
              <button className="bg-gray-700 hover:bg-gray-500 text-white p-2.5 rounded-lg transition-colors" title="Column View">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button className="bg-gray-700 hover:bg-gray-500 text-white p-2.5 rounded-lg transition-colors" title="Export">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th
                    className="px-6 py-3.5 text-left font-semibold text-gray-600 uppercase text-xs tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort("name")}
                  >
                    <span className="flex items-center gap-1">Image <SortIcon field="image" /></span>
                  </th>
                  <th
                    className="px-6 py-3.5 text-left font-semibold text-gray-600 uppercase text-xs tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort("name")}
                  >
                    <span className="flex items-center gap-1">Name <SortIcon field="name" /></span>
                  </th>
                  {/* <th className="px-6 py-3.5 text-left font-semibold text-gray-600 uppercase text-xs tracking-wider">Brand</th> */}
                  <th className="px-6 py-3.5 text-left font-semibold text-gray-600 uppercase text-xs tracking-wider">Category</th>
                  {/* <th
                    className="px-6 py-3.5 text-center font-semibold text-gray-600 uppercase text-xs tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort("rating")}
                  > */}
                  {/* <span className="flex items-center justify-center gap-1">Rating <SortIcon field="rating" /></span> */}
                  {/* </th> */}
                  {/* <th className="px-6 py-3.5 text-center font-semibold text-gray-600 uppercase text-xs tracking-wider">Status</th> */}
                  <th className="px-6 py-3.5 text-center font-semibold text-gray-600 uppercase text-xs tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Product?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-gray-400 text-sm">
                      No products found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts?.map((product, i) => (
                    <tr key={product.id} className="hover:bg-blue-50/30 transition-colors duration-100">
                      <td className="px-6 py-4">
                        <img
                          src={`${product.image}`}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      </td>
                      <td className="px-6 py-4 w-sm">
                        <p className="font-semibold text-gray-800 leading-snug line-clamp-2">{product.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{product.type}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          By <span className="font-semibold text-gray-700">{product.seller}</span>
                        </p>
                      </td>
                      {/* <td className="px-6 py-4 text-gray-600 font-medium">{product.brand}</td> */}
                      <td className="px-6 py-4 max-w-sm">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                          {category && category.find((cat) => cat.id === product.category_id)?.name || '-'}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4"> */}
                      {/* <StarRating rating={product.rating} count={product.reviewCount} /> */}
                      {/* </td> */}
                      {/* <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${product.status === "active"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                            }`}
                        >
                          {product.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td> */}
                      <td className="px-6 py-4">
                        <ActionButtons product={product} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
            <Toaster position="bottom-right" reverseOrder={false} />

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing {Product?.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, Product?.length || 0)} of {Product?.length || 0} products
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors text-gray-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >← Prev</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded border font-semibold transition-colors ${currentPage === page
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-gray-300 hover:bg-gray-100 text-gray-600"
                    }`}
                >{page}</button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors text-gray-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >Next →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Add New Product</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Product Name</label>
                <input type="text" placeholder="Enter product name" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Category</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {categories.slice(1).map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Brand</label>
                  <input type="text" placeholder="Brand name" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Seller</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {sellers.slice(1).map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-500 rounded-lg transition-colors shadow-sm">
                Save Product
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}