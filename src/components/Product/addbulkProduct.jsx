import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import api from "../../api/axiosinterceptor";
import ENDPOINTS from "../../utils/ENDPOINTS";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

export default function AddBulkProduct() {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const excelRef = useRef();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // Optional: Preview the data in the console or UI
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);
            setPreviewData(data.slice(0, 5)); // Show first 5 rows as preview
        };
        reader.readAsBinaryString(selectedFile);
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Please select an Excel file first");
            return;
        }

        const formData = new FormData();
        formData.append("file", file); // The key 'file' must match req.file in backend

        setLoading(true);
        try {
            const response = await api.post({ url: ENDPOINTS.OTHER.BULK_PRODUCTS, data: formData, });

            toast.success("Products imported successfully!");
            console.log("bulk prd res", response)
            navigate("/manage-products");
        } catch (error) {
            const msg = error.response?.data?.errors
                ? error.response.data.errors.join(", ")
                : "Import failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Toaster />
            <div className="bg-white border rounded-xl shadow-sm p-6">
                <h1 className="text-xl font-bold mb-4">Bulk Import Products</h1>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50">
                    <input
                        type="file"
                        ref={excelRef}
                        hidden
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => excelRef.current.click()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {file ? "Change File" : "Select Excel File"}
                    </button>
                    {file && <p className="mt-2 text-sm text-green-600 font-medium">Selected: {file.name}</p>}
                </div>

                {previewData.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-bold text-gray-500 mb-2">Preview (First 5 rows):</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {Object.keys(previewData[0]).map(key => <th key={key} className="p-2 border">{key}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, i) => (
                                        <tr key={i}>
                                            {Object.values(row).map((val, j) => <td key={j} className="p-2 border truncate max-w-[150px]">{val}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="bg-green-600 text-white px-8 py-2 rounded-md font-bold disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Upload & Create Products"}
                    </button>
                </div>
            </div>
        </div>
    );
}