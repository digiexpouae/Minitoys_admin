import { useState, useRef, useEffect } from "react";
import ENDPOINTS from "../../utils/ENDPOINTS";
import api from "../../api/axiosinterceptor";
import { useParams } from "react-router";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
// const parentCategories = [
//   "Electronics",
//   "Men Fashion",
//   "Women Fashion",
//   "Footwear",
//   "Beauty & Personal Care",
//   "Home & Kitchen",
//   "Sports & Outdoors",
//   "Books",
//   "Toys & Games",
// ];

export default function AddCategory() {
  const [formValues, setFormValues] = useState({
    name: '',
    image: ''
  });
  const navigate = useNavigate()
  const BASEURL = import.meta.env.VITE_BASEURL
  // const [parent, setParent] = useState("");
  // const [mainImage, setMainImage] = useState(null);
  // const [bannerImage, setBannerImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { id } = useParams()
  const mainInputRef = useRef();
  const bannerInputRef = useRef();


  const handleReset = () => {
    setName("");
    setParent("");
    setMainImage(null);
    setBannerImage(null);
    setMainPreview(null);
    setBannerPreview(null);
    setErrors({});
    setSubmitted(false);
    if (mainInputRef.current) mainInputRef.current.value = "";
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const validate = () => {
    const e = {};
    if (!formValues.name.trim()) e.name = "Category name is required.";
    if (!formValues.image) e.image = "Main image is required.";
    return e;
  };

  const handleSubmit = async () => {
    console.log("function runs ")
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;  // ✅ stop if 
    const formData = new FormData()
    formData.append("name", formValues.name)
    console.log("formvalues.image", formValues.image)
    formData.append("image", formValues.image)

    try {

      console.log("Formdata", formData)
      if (id) {
        const res = await api.put({
          url: `${ENDPOINTS.OTHER.CATEGORY}/${id}`, data: formData,
          headers: { "Content-Type": "multipart/form-data" }
        })
        console.log("Response", res)


        if (res.success) {
          toast.success("Category Updated successfully");
          navigate('/manage-category')


        }
      }
      else {
        const response = await api.post({
          url: `${ENDPOINTS.OTHER.CATEGORY}/new`, data: formData,
          headers: { "Content-Type": "multipart/form-data" }

        })
        if (response.success) {
          setFormValues({ name: '', image: '' })
          setMainPreview(null)
          setSubmitted(true)
          toast.success("Category Added successfully");



        }
      }
    }
    catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete image");
      console.error("Delete image error:", error?.message);
    }


  };
  const handleChange = (e) => {
    console.log("handleChange fired");                    // ✅ is function called?
    console.log("e.target.files", e.target.files)
    if (e.target.files && e.target.files[0]) {
      // File input
      const file = e.target.files[0]

      const url = URL.createObjectURL(file);
      console.log("url", url)
      setMainPreview(url);
      setFormValues((prev) => ({ ...prev, image: file }));
      return; // ✅ stop here
    }

    // Text input
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };
  const FetchData = async () => {
    const response = await api.get({ url: `${ENDPOINTS.OTHER.CATEGORY}/${id}` })
    console.log("response ", response);
    const data = response.category
    setFormValues({
      name: data.name,
      image: data.image
    })
  }

  useEffect(() => {

    if (id) {
      FetchData()
    }
  }, [id])
  const handleDeleteImage = async (id) => {  // ✅ missing async
    try {
      const response = await api.delete({    // ✅ should be delete not get
        url: `${ENDPOINTS.OTHER.CATEGORY}/category-image/${id}`
      });

      if (response.success) {

        toast.success("Image deleEted successfully");
        FetchData();  // ✅ refresh data
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete image");
      console.error("Delete image error:", error?.message);
    }
  };
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Add Category</h1>
        <nav className="text-sm flex items-center gap-2">
          <a href="#" className="text-blue-700 hover:text-blue-500 font-medium transition-colors">Home</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Category</span>
        </nav>
      </div>

      {/* Card */}
      <div className="px-8 py-8 max-w-3xl">
        {submitted && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 flex items-center gap-2 text-sm font-medium">
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Category "<span className="font-bold">{name}</span>" added successfully!
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-8 space-y-7">

          {/* Name */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
            <label className="sm:w-36 shrink-0 text-sm font-bold text-gray-800 pt-2.5">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={(e) => handleChange(e)}
                placeholder="Category Name"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.name ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
                  }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Select Parent */}
          {/* <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
            <label className="sm:w-36 shrink-0 text-sm font-bold text-gray-800 pt-2.5">
              Select Parent
            </label>
            <div className="flex-1">
              <select
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
              >
                <option value="">Select Parent</option>
                {parentCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div> */}

          <div className="border-t border-gray-100" />

          {/* Main Image */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
            <label className="sm:w-36 shrink-0 text-sm font-bold text-gray-800 pt-1">
              Main Image <span className="text-red-500">*</span>
              <span className="block text-xs text-gray-400 font-normal mt-0.5">(Recommended: 131 × 131 px)</span>
            </label>
            <div className="flex-1 space-y-3">
              <input
                ref={mainInputRef}
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleChange(e)}
              />
              <button
                onClick={() => {
                  mainInputRef.current.click();
                }
                }
                className="bg-blue-700 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload
              </button>
              {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
              {mainPreview && (
                <div className="relative inline-block group">
                  <img src={mainPreview} alt="Main preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm" />
                  <button
                    onClick={() => { setFormValues((prev) => ({ ...prev, image: null })); setMainPreview(null); if (mainInputRef.current) mainInputRef.current.value = ""; }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center text-xs shadow transition-colors"
                  >×</button>
                  <p className="text-xs text-gray-500 mt-1">{formValues?.name}</p>
                </div>
              )}
              {!mainPreview && formValues.image &&
                (
                  <div className="relative inline-block group">
                    <img src={formValues.image} alt="Main preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm" />
                    <button
                      onClick={() => handleDeleteImage(id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center text-xs shadow transition-colors"
                    >×</button>
                    {/* <p className="text-xs text-gray-500 mt-1">{mainImage?.name}</p> */}
                  </div>
                )}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Banner Image */}
          {/* <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
            <label className="sm:w-36 shrink-0 text-sm font-bold text-gray-800 pt-1">
              Banner Image
              <span className="block text-xs text-gray-400 font-normal mt-0.5">(Recommended: 1200 × 300 px)</span>
            </label>
            <div className="flex-1 space-y-3">
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, "banner")}
              />
              <button
                onClick={() => bannerInputRef.current.click()}
                className="bg-blue-700 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload
              </button>
              {bannerPreview && (
                <div className="relative inline-block group">
                  <img src={bannerPreview} alt="Banner preview" className="w-48 h-20 object-cover rounded-lg border border-gray-200 shadow-sm" />
                  <button
                    onClick={() => { setBannerImage(null); setBannerPreview(null); if (bannerInputRef.current) bannerInputRef.current.value = ""; }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center text-xs shadow transition-colors"
                  >×</button>
                  <p className="text-xs text-gray-500 mt-1">{bannerImage?.name}</p>
                </div>
              )}
            </div>
          </div> */}

          <div className="border-t border-gray-100" />

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleReset}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 text-sm font-bold px-6 py-2.5 rounded-lg transition-colors duration-150 shadow-sm"
            >
              Reset
            </button>
            <button
              onClick={() => handleSubmit()}
              className={`${!id ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500'} text-white text-sm font-bold px-7 py-2.5 rounded-lg transition-colors duration-150 shadow-sm flex items-center gap-2`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {id ? "Edit Category" : "Add Category"}
            </button>
          </div>

        </div>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />

    </div >
  );
}