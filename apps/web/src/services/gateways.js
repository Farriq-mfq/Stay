import { instance } from '@/utils/axios'
import { buildQueryString } from '../helpers/functions';


/**
 * Fetches a list of gateways from the API.
 *
 * @param {number|null} page - The page number to fetch. If null, fetches the first page.
 * @param {number|null} limit - The number of results to fetch per page. If null, uses the default limit.
 * @param {string|null} search - A search query to filter the results.
 * @param {string|null} role - A role to filter the results by.
 * @returns {Promise<AxiosResponse<any>>} - The API response containing the gateway data.
 */
export const getAllGateways = async (page = null, limit = null, search = null, role = null) => {
    const queryParams = buildQueryString({ page, limit, search, role });
    return await instance.get(`/gateways${queryParams}`);
};
