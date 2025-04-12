import { defineStore } from "pinia"
import { config } from '@/config'

export const useBallance = defineStore("ballance", {
    state: () => {
        return {
            showBallance: localStorage.getItem(`${config.STORAGE_KEY}/showBallance`) === null ? true : localStorage.getItem(`${config.STORAGE_KEY}/showBallance`) === "true" ? true : false,
        }
    },
    actions: {
        toogleShowBallance() {
            this.showBallance = !this.showBallance
            localStorage.setItem(`${config.STORAGE_KEY}/showBallance`, this.showBallance)
        },
    },
    getters: {
        getShowBallance: (state) => state.showBallance
    }
})


