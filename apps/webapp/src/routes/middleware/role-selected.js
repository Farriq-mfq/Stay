import { config } from "../../config";

export const ROLES = ["SISWA", "PEGAWAI"];
/**
 * @type {import('vue-router').RouteMiddleware}
 */
export async function checkRoleSelectedMiddleware(route) {
    const getRole = localStorage.getItem(config.STORAGE_KEY + "/role");
    if (getRole && route.name === 'role') {
        return {
            name: 'dashboard'
        }
    }
}