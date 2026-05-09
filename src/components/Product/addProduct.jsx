import { useEffect, useState } from "react";
import api from "../../api/axiosinterceptor";
import ENDPOINTS from "../../utils/ENDPOINTS";
import z from "zod";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
const SUBCATS = {
  apparel: ["T-Shirts", "Jackets", "Dresses", "Trousers", "Activewear"],
  footwear: ["Sneakers", "Boots", "Sandals", "Formal", "Slippers"],
  electronics: ["Phones", "Laptops", "Audio", "Wearables", "Accessories"],
  home: ["Furniture", "Decor", "Kitchen", "Bedding", "Lighting"],
  beauty: ["Skincare", "Haircare", "Fragrance", "Makeup", "Tools"],
  sports: ["Running", "Yoga", "Cycling", "Team Sports", "Outdoor"],
};

const SELLERS = [
  { initials: "TR", name: "Thomas Reeves", role: "Store Manager" },
  { initials: "AL", name: "Aliya Luo", role: "Vendor Partner" },
  { initials: "MD", name: "Marcus Diallo", role: "Wholesale Seller" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = ["Black", "White", "Navy", "Cream", "Olive"];

const STATUS_OPTIONS = [
  { value: "active", label: "Active — visible in store", color: "bg-green-500" },
  { value: "draft", label: "Draft — not published", color: "bg-gray-400" },
  { value: "archived", label: "Archived", color: "bg-orange-500" },
];

// function Toggle({ items, selected, onToggle }) {
//   return (
//     <div className="flex flex-wrap gap-2 mt-1">
//       {items.map((item) => (
//         <button
//           key={item}
//           type="button"
//           onClick={() => onToggle(item)}
//           className={`px-3 py-1 rounded-full text-sm border transition-all ${selected.includes(item)
//             ? "bg-gray-900 text-white border-gray-900"
//             : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
//             }`}
//         >
//           {item}
//         </button>
//       ))}
//     </div>
//   );
// }

function Card({ title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      {title && (
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="mb-4 last:mb-0">
      {label && (
        <label className="block text-sm text-gray-500 mb-1">{label}</label>
      )}
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition placeholder-gray-300";

const selectCls =
  "w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition appearance-none cursor-pointer";

export default function AddProduct() {
  const [status, setStatus] = useState("active");
  const [category, setCategory] = useState("");
  const [subcat, setSubcat] = useState("");
  const [seller, setSeller] = useState(null);
  const [tags, setTags] = useState(["new-arrival"]);
  const [tagInput, setTagInput] = useState("");
  const [sizes, setSizes] = useState(["S", "M", "L"]);
  const [colors, setColors] = useState(["Black"]);
  const [heroPreview, setHeroPreview] = useState(null);
  const [heroName, setHeroName] = useState("");
  const [thumbs, setThumbs] = useState([]);

  const { slug } = useParams()

  const [form, setForm] = useState({
    name: "",
    description: "",
    // sku: "",
    // barcode: "",
    price: null,
    image: "",
    additionalImages: [],
    // comparePrice: "",
    category: null,
    stock: null,
    // lowStock: "",
    // weight: "",
    // tax: "Standard rate",
  });

  const navigate = useNavigate();

  const formValidation = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number({ required_error: "Price is required" }).positive("Price must be greater than 0"),
    category: z.coerce.number({ required_error: "Category is required" }).positive("Category is required"),
    stock: z.coerce.number({ required_error: "Stock is required" }).positive("Stock is required"),
    additionalImages: z.array(z.any())
      .min(1, "Please upload at least one image")
      .max(5, "You can only upload up to 5 images"),
    image: z.any().refine((file) => file, "Hero image is required"),
  });


  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // File input
      const file = e.target.files[0]
      console.log("file ", file)
      const url = URL.createObjectURL(file);
      console.log("url", url)
      setHeroPreview(url);
      setForm((prev) => ({ ...prev, image: file }));
      return; // ✅ stop here
    }

    // Text input
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" || name === "category" ? Number(value) : value,
    }));    // setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFormChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleHero = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    console.log("file", file)
    setForm()
    reader.onload = (ev) => setHeroPreview(ev.target.result)
    console.log('hero', heroPreview)
    reader.readAsDataURL(file);
    setHeroName(file.name);
  };
  const handleThumbs = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setThumbs((prev) => [...prev, url]);
      setForm((prev) => ({
        ...prev, additionalImages:
          [...prev.additionalImages, file]
      }))
      console.log("e.target.files", e.target.files)
    });

  };
  const removeThumb = (idx) => {
    setThumbs((prev) => prev.filter((_, i) => i !== idx));
    setForm((prev) => ({
      ...prev, additionalImages:
        [prev.filter((_, i) => i !== idx)]
    }));
  }

  const addTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.replace(",", "").trim();
      if (val && !tags.includes(val)) setTags((t) => [...t, val]);
      setTagInput("");
    }
  };

  const removeTag = (tag) => setTags((t) => t.filter((x) => x !== tag));

  const toggleSize = (s) =>
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const toggleColor = (c) =>
    setColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const handleSellerChange = (e) => {
    const found = SELLERS.find((s) => s.name === e.target.value);
    setSeller(found || null);
  };

  const FetchCategory = async () => {
    const response = await api.get({ url: `${ENDPOINTS.OTHER.CATEGORY}/admin/all` })
    // console.log("response", response)
    setCategory(response.categories)
    // }
  }

  useEffect(() => {
    FetchCategory()
  }, [])


  const FetchData = async () => {
    const response = await api.get({ url: `${ENDPOINTS.OTHER.PRODUCTS}/${slug}` })
    console.log("response ", response);
    const data = response.product
    console.log("Data", data)
    const parsedAdditionalImages = JSON.parse(data.additional_images) // ["uploads\\abc.jpeg", ...]

    setForm({
      name: data.name,
      description: data.description,
      stock: data.stock,
      category: data.category_id,
      image: data.image,
      additionalImages: JSON.parse(data.additional_images) ?? [] ,
      price: data.price
    })
    setHeroPreview(`${import.meta.env.VITE_BASEURL
      }/${data.image}`)
    setThumbs(parsedAdditionalImages.map(img => `${import.meta.env.VITE_BASEURL}/${img}`))


  }

  useEffect(() => {

    if (slug) {
      FetchData()
    }
  }, [slug])





  const handleSubmit = async (e) => {
    // Prevent page refresh if called from a form submit event
    e?.preventDefault();
    console.log("form", form)


    try {
      // 1. Schema Validation
      // This will throw an error immediately if the form is invalid

      formValidation.parse({
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category,
        stock: form.stock,
        image: form.image,
        additionalImages: form.additionalImages
      });

      // 2. Prepare FormData
      const formdata = new FormData();
      formdata.append("name", form.name);
      formdata.append("description", form.description);
      formdata.append("category_id", form.category);
      formdata.append("stock", String(form.stock)); // FormData usually prefers strings/blobs
      formdata.append("price", String(form.price));

      // Append the Hero Image (only if it exists)
      if (form.image) {
        formdata.append("image", form.image);
      }

      // Append Additional Images
      form.additionalImages.forEach((file) => {
        // NOTE: Ensure 'additionalImage' matches what your Multer backend expects
        formdata.append('additional_images', file);
      });

      // 3. API Call
      if (slug) {

        const response = await api.put({
          url: `${ENDPOINTS.OTHER.PRODUCTS}/${slug}`,
          data: formdata,
          // If using axios/fetch directly, ensure headers aren't manually overriding multipart
        });
        console.log("Success:", response);
        if (response.success) {
          toast.success("Product Created Successfully")
          setTimeout(() => navigate("/"), 500)

        }
      }
      else {
        const response = await api.post({
          url: `${ENDPOINTS.OTHER.PRODUCTS}/new`,
          data: formdata,
          // If using axios/fetch directly, ensure headers aren't manually overriding multipart
        });
        console.log("Success:", response);
        if (response.success) {
          toast.success("Product Created Successfully")
          setTimeout(() => navigate("/"), 500)

        }
      }




      // Add success logic here (e.g., toast notification, redirect)

    } catch (error) {
      // 4. Error Handling Logic
      if (error instanceof z.ZodError) {
        const firstIssue = error.issues?.[0];

        if (firstIssue) {
          const fieldName = firstIssue.path?.[0];
          const message = firstIssue.message;

          if (fieldName) {
            toast.error(fieldName ? `${fieldName}: ${message}` : message)
          } else {
            toast.error(message);
          }
        } else {
          toast.error("Validation failed");
        }
      }
      else {
        // Handle Network or Server Errors
        console.error("Server Error:", error.response?.data || error.message);
        toast.error(error.response?.data || error.message || "Something went wrong. Please try again!");

      }
    }
  };








  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <span>Catalog</span>
          <span>›</span>
          <span>Products</span>
          <span>›</span>
          <span className="text-gray-800 font-medium">Add new product</span>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-sm px-4 py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          {/* <button
            type="button"
            className="text-sm px-4 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            Save draft
          </button> */}
          <button
            type="button"
            className={`text-sm px-4 py-1.5 rounded-md  ${slug ? "bg-green-500 hover:bg-green-400 " : "bg-blue-500 hover:bg-blue-400 "} text-white font-medium transition`}
            onClick={handleSubmit}
          >
            {slug ? "Update product" : "Publish product"}
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-5">

          {/* Basic Info */}
          <Card title="Basic information">
            <Field label="Product name">
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className={inputCls}
                placeholder="e.g. Classic Leather Sneaker"
              />
            </Field>
            <Field label="Description">
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                rows={4}
                className={inputCls + " resize-none"}
                placeholder="Describe materials, key features, sizing notes…"
              />
            </Field>
            {/* <div className="grid grid-cols-2 gap-3">
              {/* <Field label="SKU / Product ID">
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleFormChange}
                  className={inputCls}
                  placeholder="SKU-00123"
                />
              </Field>
              <Field label="Barcode (optional)">
                <input
                  name="barcode"
                  value={form.barcode}
                  onChange={handleFormChange}
                  className={inputCls}
                  placeholder="0123456789"
                />
              </Field> */}
            {/* </div> */}
          </Card>

          {/* Hero Image */}
          <Card title="Hero image">
            <label
              className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl cursor-pointer transition overflow-hidden ${heroPreview
                ? "border-gray-200"
                : "border-gray-200 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
                }`}
              style={{ minHeight: heroPreview ? 200 : 160 }}
            >
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                name="image"
                onChange={handleChange}
              />
              {heroPreview ? (
                <img
                  src={heroPreview}
                  alt="hero preview"

                  className="w-full h-48 object-cover rounded-xl"
                />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Upload cover image</p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, WEBP — 1200×1200px recommended
                  </p>
                </>
              )}
            </label>
            {heroName && (
              <p className="text-xs text-gray-400 mt-2 truncate">{heroName}</p>
            )}
          </Card>

          {/* Additional Images */}
          <Card title="Additional images">
            <p className="text-xs text-gray-400 -mt-2 mb-4">Add up to 8 gallery images.</p>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {thumbs.map((src, i) => {
                return (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group"
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeThumb(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>)
              })}
              {thumbs.length < 8 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleThumbs}
                  />
                  <span className="text-2xl text-gray-400 leading-none">+</span>
                </label>
              )}
            </div>
          </Card>

          {/* Pricing & Inventory */}
          <Card title="Pricing & inventory">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Field label="Price">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className={inputCls + " pl-6"}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </Field>
              <Field label="Stock quantity">
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="0"
                  min="0"
                />
              </Field>
              {/* <Field label="Compare-at price">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    name="comparePrice"
                    type="number"
                    value={form.comparePrice}
                    onChange={handleChange}
                    className={inputCls + " pl-6"}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </Field> */}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="grid grid-cols-2 gap-3">

                {/* <Field label="Low stock alert">
                  <input
                    name="lowStock"
                    type="number"
                    value={form.lowStock}
                    onChange={handleFormChange}
                    className={inputCls}
                    placeholder="5"
                    min="0"
                  />
                </Field> */}
              </div>
            </div>

            {/* <div className="border-t border-gray-100 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Weight (kg)">
                  <input
                    name="weight"
                    type="number"
                    value={form.weight}
                    onChange={handleFormChange}
                    className={inputCls}
                    placeholder="0.0"
                    min="0"
                    step="0.1"
                  />
                </Field>
                <Field label="Tax class">
                  <select
                    name="tax"
                    value={form.tax}
                    onChange={handleFormChange}
                    className={selectCls}
                  >
                    <option>Standard rate</option>
                    <option>Zero rate</option>
                    <option>Reduced rate</option>
                  </select>
                </Field>
              </div>
            </div> */}
          </Card>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-5">

          {/* Status */}
          {/* <Card title="Status">
            {STATUS_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition mb-2 last:mb-0 ${status === opt.value
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-100 hover:bg-gray-50"
                  }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${opt.color}`} />
                <span className="text-sm text-gray-700 flex-1">{opt.label}</span>
                {status === opt.value && (
                  <span className="text-gray-400 text-sm">✓</span>
                )}
              </div>
            ))}
          </Card> */}

          {/* Category */}
          <Card title="Category">
            <Field label="Primary category">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select Category</option>
                {category && category.map((cat, index) => {
                  return (
                    <option key={index} value={cat.id}>{cat.name}</option>)
                })}




              </select>
            </Field>
            {/* <Field label="Subcategory">
              <select
                className={selectCls}
                value={subcat}
                onChange={(e) => setSubcat(e.target.value)}
                disabled={!category}
              >
                <option value="">
                  {category ? "All subcategories" : "Select category first"}
                </option>
                {(SUBCATS[category] || []).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field> */}
          </Card>

          {/* Seller */}
          {/* <Card title="Seller">
            <Field label="Assigned seller">
              <select
                className={selectCls}
                onChange={handleSellerChange}
                defaultValue=""
              >
                <option value="">Choose seller…</option>
                {SELLERS.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} — {s.role}
                  </option>
                ))}
              </select>
            </Field>
            {seller && (
              <div className="flex items-center gap-3 mt-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                  {seller.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{seller.name}</p>
                  <p className="text-xs text-gray-400">{seller.role}</p>
                </div>
              </div>
            )}
          </Card> */}

          {/* Tags */}
          <Card title="Tags">
            <div
              className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-xl min-h-[42px] cursor-text"
              onClick={() => document.getElementById("tagInput").focus()}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs bg-gray-100 border border-gray-200 rounded-md px-2 py-1 text-gray-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-400 hover:text-gray-700 ml-0.5 leading-none"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                className="text-sm outline-none bg-transparent flex-1 min-w-[80px] placeholder-gray-300 p-1"
                placeholder="Add a tag…"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Press Enter or comma to add
            </p>
          </Card>

          {/* Variants */}
          {/* <Card title="Variants">
            <Field label="Available sizes">
              <Toggle items={SIZES} selected={sizes} onToggle={toggleSize} />
            </Field>
            <div className="border-t border-gray-100 pt-4 mt-1">
              <Field label="Colors">
                <Toggle items={COLORS} selected={colors} onToggle={toggleColor} />
              </Field>
            </div>
          </Card> */}

        </div>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />

    </div>
  );
}