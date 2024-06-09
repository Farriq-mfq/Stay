import { instance } from '@/utils/axios'


const getAllGateways = (page = null, limit = null, search = null, role = null) => {
    return await instance.get('/gateways')
}