import { defineStore } from "pinia"
import { ROLES } from "../routes/middleware/role-selected"
import { config } from "../config";

export const useRole = defineStore("role", {
    state: () => ({
        role: null,
    }),
    actions: {
        setRole(role) {
            if (ROLES.includes(role)) {
                this.role = role
                localStorage.setItem(config.STORAGE_KEY + "/role", role);
            }

        }
    },
    getters: {
        getShowAppNav: (state) => state.role
    }
})