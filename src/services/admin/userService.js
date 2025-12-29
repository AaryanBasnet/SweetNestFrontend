import * as customersApi from "../../api/admin/customersApi";

/**
 * Fetch all customers (admin)
 */
export const fetchCustomers = async (params = {}) => {
  const response = await customersApi.getCustomersApi(params);
  console.log("Fetched customers:", response.data);
  return response.data;
};
