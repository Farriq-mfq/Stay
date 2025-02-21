import { defineStore } from "pinia"

export const useApp = defineStore("app", {
    state: () => ({
        showAppNav: true,
        showRoleDialog: false
    }),
    actions: {
        setShowAppNav() {
            this.showAppNav = true
        },
        hideAppNav() {
            this.showAppNav = false
        },
        showRoleDialog() {
            this.showRoleDialog = true
        },
        hideRoleDialog() {
            this.showRoleDialog = false
        }
    },
    getters: {
        getShowAppNav: (state) => state.showAppNav,
        getShowRoleDialog: (state) => state.showRoleDialog
    }
})