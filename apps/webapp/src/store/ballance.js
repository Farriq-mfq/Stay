import { defineStore } from "pinia"

export const useBallance = defineStore("ballance", {
    state: () => ({
        showBallance: localStorage.getItem("showBallance") === "true" ? true : false,
    }),
    actions: {
        toogleShowBallance() {
            this.showBallance = !this.showBallance
            localStorage.setItem("showBallance", this.showBallance)
        },
    },
    getters: {
        getShowBallance: (state) => state.showBallance
    }
})


