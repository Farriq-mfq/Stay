import { config } from "../../config";

export const ROLES = ["SISWA", "PEGAWAI"];
export async function checkRoleSelectedMiddleware(route) {
    const getRole = localStorage.getItem(config.STORAGE_KEY + "/role");
    if (getRole != null && ROLES.includes(getRole)) {
        // window.location.reload()
        console.log(getRole);
    }
}