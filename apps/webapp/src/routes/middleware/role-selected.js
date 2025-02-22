import { config } from "../../config";

export const ROLES = ["SISWA", "PEGAWAI"];
/**
 * @type {import('vue-router').RouteMiddleware}
 */
export async function checkRoleSelectedMiddleware(to) {
    const getRole = localStorage.getItem(config.STORAGE_KEY + "/role");
    if (getRole != null && ROLES.includes(getRole)) {
        return {
            name: 'dashboard'
        };
    }
}