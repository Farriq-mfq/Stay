import { defineStore } from "pinia"

export const useApp = defineStore("app", {
    state: () => ({
        showAppNav: true
    }),
    actions: {
        setShowAppNav() {
            this.showAppNav = true
        },  
        hideAppNav() {
            this.showAppNav = false
        }
    },
    getters: {
        getShowAppNav: (state) => state.showAppNav
    }
})