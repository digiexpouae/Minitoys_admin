// import React, { useState,useEffect } from 'react'
// // import Setting from '../components/setting/index'
// import { fetchcapexCategories,fetchDepartments,GETDATA} from '../components/function'
// import ENDPOINTS from '../utils/ENDPOINTS'
// const setting = () => {
//       const [departments, setDepartments] = useState([]);
//       const [fetchVendor,setfetchVendor]=useState(null)


//     const fetchVendordata= async ()=>{

//        const response= await GETDATA(ENDPOINTS.OTHER.VENDOR)
//         setfetchVendor(response.vendors)


//       }


//     useEffect(() => {

//       fetchDepartments()
//       fetchcapexCategories()
//       fetchVendordata()
//     console.log("departments",departments)
     
 
//   }, []);



//   return (
// <>
// <Setting departments={departments} fetchVendordata={fetchVendordata} fetchVendor={fetchVendor} fetchcapexCategories={fetchcapexCategories} fetchDepartments={fetchDepartments} />
// </>
//   )
// }

// export default setting