import { useState, useMemo, useEffect } from "react";
import ENDPOINTS from "../../utils/ENDPOINTS";
import Cookies from 'js-cookie'
import api from "../../api/axiosinterceptor";
import { useNavigate } from "react-router";
import { Toaster, toast } from "react-hot-toast";
// ─── Mock Data (replace with API call) ───────────────────────────────────────
const MOCK_CATEGORIES = [
  { id: 1, name: "Gaming", image: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=80&h=80&fit=crop", banner: null, status: "active" },
  { id: 2, name: "Electronics", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=80&h=80&fit=crop", banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=80&fit=crop", status: "active" },
  { id: 3, name: "Men Fashion", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=80&h=80&fit=crop", banner: null, status: "inactive" },
  { id: 4, name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop", banner: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=80&fit=crop", status: "active" },
  { id: 5, name: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop", banner: null, status: "inactive" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NoImagePlaceholder() {
  return (
    <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1">
      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-xs text-gray-400 font-medium">NO IMAGE</span>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-block text-xs font-bold px-3 py-1 rounded ${status === "active"
      ? "bg-green-500 text-white"
      : "bg-red-100 text-red-600 border border-red-200"
      }`}>
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}

function SortIcon({ field, sortField, sortDir }) {
  return (
    <span className="inline-flex flex-col ml-1 leading-none">
      <svg className={`w-2.5 h-2.5 ${sortField === field && sortDir === "asc" ? "text-blue-700" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 10 6">
        <path d="M5 0L10 6H0z" />
      </svg>
      <svg className={`w-2.5 h-2.5 ${sortField === field && sortDir === "desc" ? "text-blue-700" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 10 6">
        <path d="M5 6L0 0H10z" />
      </svg>
    </span>
  );
}



function TreeNode({ category, depth = 0, onToggleStatus, id, onDelete, image, onEdit }) {
  const [open, setOpen] = useState(true);
  const hasChildren = category.children?.length > 0;





  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-3 py-2.5 px-4 hover:bg-blue-50/40 transition-colors ${depth > 0 ? "border-l-2 border-blue-100 ml-6" : ""}`}
      >
        {hasChildren ? (
          <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-blue-700 transition-colors">
            <svg className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="w-4" />
        )}
        {image ?
          <img src={image} alt={category.name} className="w-8 h-8 rounded object-cover border border-gray-200" />
          : <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        }
        <span className="text-sm font-semibold text-blue-700 flex-1">{category.name}</span>
        <StatusBadge status={category.status} />
        <div className="flex gap-1.5 ml-2">
          <button className="w-7 h-7 rounded bg-green-500 hover:bg-green-400 text-white flex items-center justify-center transition-colors" title="Edit"
            onClick={() => onEdit(id)}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => {
            onDelete(id)
            console.log("delete ")
          }} className="w-7 h-7 rounded bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition-colors" title="Delete"


          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button onClick={() => onToggleStatus(id)} className="w-7 h-7 rounded bg-yellow-400 hover:bg-yellow-300 text-gray-800 flex items-center justify-center transition-colors" title="Toggle Status">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
      </div>
      {
        hasChildren && open && category.children.map((child) => (
          <TreeNode key={child.id} category={child} depth={depth + 1} onToggleStatus={onToggleStatus} onDelete={onDelete} />
        ))
      }
    </div >
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ManageCategory() {


  const BASEURL = import.meta.env.VITE_BASEURL
  const [categories, setCategories] = useState(MOCK_CATEGORIES);

  const [category, setcategory] = useState()
  const [view, setView] = useState("list"); // "list" | "tree"
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [searchTerm, setSearchTerm] = useState();
  const [filterCategories, setfilterCategories] = useState()
  const navigate = useNavigate()
  const handleToggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c)
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete({
        url: `${ENDPOINTS.OTHER.CATEGORY}/${id}`
      });

      if (response.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        FetchCategory()
        toast.success("Category deleted successfully");

      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete category");
      console.error("Delete category error:", error?.message);
    }
  };
  const handleEdit = async (id) => {
    console.log("Edit works")
    console.log("id", id)
    return navigate(`/update-category/${id}`)
  }

  const applyFilters = (search) => {
    let filtered = [...category]


    if (search) {
      console.log('search term', search)
      console.log('filterCategories', filterCategories)
      const normalizedSearch = search.trim().toLowerCase()
      filtered = filtered.filter((elem) =>
        elem.name.trim().toLowerCase().includes(normalizedSearch)
      )
      setfilterCategories(filtered)


    }
  }


  const handleSearchFilter = (e) => {
    const selectedSearch = e.target.value
    console.log("search value", e.target.value)
    setSearchTerm(selectedSearch)
    applyFilters(selectedSearch)

  }

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  // const filtered = useMemo(() => {
  //   let list = categories.filter((c) =>
  //     c.name.toLowerCase().includes(search.toLowerCase())
  //   );



  //     if (sortField) {
  //     list = [...list].sort((a, b) => {
  //       const va = a[sortField]?.toLowerCase?.() ?? "";
  //       const vb = b[sortField]?.toLowerCase?.() ?? "";
  //       return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  //     });
  //   }
  //   return list;
  // }, [categories, search, sortField, sortDir]);

  // Build tree from flat list (parent_id based — adapt when API is connected)


  // const treeData = useMemo(() => filtered.map((c) => ({ ...c, children: [] })), [filtered]);



  const token = Cookies.get("adminToken")
  const FetchCategory = async () => {
    const response = await api.get({ url: `${ENDPOINTS.OTHER.CATEGORY}/admin/all` })
    // console.log("response", response)
    setcategory(response.categories)
    // }
  }
  useEffect(() => {

    if (token) {
      FetchCategory()
    }
  }, [token])
  const Categoires = !searchTerm == '' && Array.isArray(filterCategories) && filterCategories.length > 0 ? filterCategories : category;


  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Category</h1>
        <nav className="text-sm flex items-center gap-2">
          <a href="#" className="text-blue-700 hover:text-blue-500 font-medium transition-colors">Home</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Category</span>
        </nav>
      </div>

      <div className="px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

          {/* Top Controls */}
          <div className="px-6 pt-5 pb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
            {/* View Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-blue-700">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${view === "list" ? "bg-blue-700 text-white" : "bg-white text-blue-700 hover:bg-blue-50"
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List View
              </button>
              <button
                onClick={() => setView("tree")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border-l border-blue-700 ${view === "tree" ? "bg-blue-700 text-white" : "bg-white text-blue-700 hover:bg-blue-50"
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h6M3 12h4m-4 5h6M13 7h8M13 12h8M13 17h8" />
                </svg>
                Tree View
              </button>
            </div>

            {/* Add Category */}
            <button className="border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors duration-150"
              onClick={() => { navigate('/add-category') }}
            >
              Add Category
            </button>
          </div>

          {/* Search + Utility Bar */}
          <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Category</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchFilter}
                  className="border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                </svg>
              </div>
              <button className="bg-gray-700 hover:bg-gray-500 text-white p-2 rounded-lg transition-colors" title="Refresh" onClick={() => setSearch("")}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.13-3.36M20 15a9 9 0 01-14.13 3.36" />
                </svg>
              </button>
              <button className="bg-gray-700 hover:bg-gray-500 text-white p-2 rounded-lg transition-colors" title="Columns">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                </svg>
              </button>
              <button className="bg-gray-700 hover:bg-gray-500 text-white p-2 rounded-lg transition-colors" title="Export">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── LIST VIEW ── */}
          {view === "list" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {[
                      { label: "Name", field: "name" },
                      { label: "Image", field: "image" },
                      // { label: "Banner", field: "banner" },
                      { label: "Status", field: "status" },
                    ].map(({ label, field }) => (
                      <th
                        key={field}
                        onClick={() => handleSort(field)}
                        className="px-6 py-3.5 text-center font-semibold text-gray-600 uppercase text-xs tracking-wider cursor-pointer select-none"
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          {label}
                          <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
                        </span>
                      </th>
                    ))}
                    <th className="px-6 py-3.5 text-center font-semibold text-gray-600 uppercase text-xs tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {category?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">
                        No categories found.
                      </td>
                    </tr>
                  ) : (
                    Categoires?.map((cat) => (
                      <tr key={cat.id} className="hover:bg-blue-50/30 transition-colors">
                        {/* Name */}
                        <td className="px-6 py-4 text-center">
                          <span className="text-blue-700 font-semibold hover:underline cursor-pointer">
                            {cat.name}
                          </span>
                        </td>

                        {/* Main Image */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            {cat.image
                              ? <img src={cat.image} alt={cat.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" />
                              : <NoImagePlaceholder />
                            }
                          </div>
                        </td>

                        {/* Banner */}
                        {/* <td className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            {cat.banner
                              ? <img src={cat.banner} alt="banner" className="w-24 h-14 object-cover rounded-lg border border-gray-200 shadow-sm" />
                              : <NoImagePlaceholder />
                            }
                          </div>
                        </td> */}

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={cat.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit */}
                            <button className="w-8 h-8 rounded bg-green-500 hover:bg-green-400 text-white flex items-center justify-center transition-colors" title="Edit" onClick={() => handleEdit(cat.id)}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {/* Delete */}
                            <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition-colors" title="Delete">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            {/* Toggle visibility */}
                            <button onClick={() => handleToggleStatus(cat.id)} className="w-8 h-8 rounded bg-yellow-400 hover:bg-yellow-300 text-gray-800 flex items-center justify-center transition-colors" title="Toggle Status">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            </button>
                          </div>

                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <Toaster position="bottom-right" reverseOrder={false} />

            </div>
          )}

          {/* ── TREE VIEW ── */}
          {view === "tree" && (
            <div className="divide-y divide-gray-100">
              {category.length === 0 ? (
                <p className="px-6 py-16 text-center text-gray-400 text-sm">No categories found.</p>
              ) : (
                category.map((cat) => (
                  <TreeNode key={cat.id} id={cat.id} category={cat} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onEdit={handleEdit} image={cat.image} />
                ))
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            {/* <span>Showing {filtered.length} of {categories.length} categories</span> */}
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors text-gray-600 font-medium">← Prev</button>
              <button className="px-3 py-1.5 rounded border border-blue-700 bg-blue-700 hover:bg-blue-500 transition-colors text-white font-semibold">1</button>
              <button className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors text-gray-600 font-medium">Next →</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}