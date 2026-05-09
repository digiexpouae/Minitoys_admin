
const ENDPOINTS = {
  AUTH: {
    LOGIN: `v1/user/admin/login`,
    REGISTER: `users/register`,
    SEND_OTP: `otp/send-otp`,
    VERIFY_OTP: `otp/verify-otp`,
    UPDATE_PASSWORD: `otp/update-password`,
    USER_LIST: `users/list`

  },
  OTHER:
  {

    PRODUCTS: 'v1/product',
    USERS: 'v1/user',
    ORDER: 'v1/order',
    CATEGORY: 'v1/category',
    BULK_PRODUCTS: 'v1/product/bulkCreate',


  }



}
export default ENDPOINTS