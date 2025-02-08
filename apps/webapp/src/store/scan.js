import { defineStore } from 'pinia'
export const useScan = defineStore("scan", {
    state: () => {
        return {
            scan: false,
            componentName: 'default',
            title: null
        }
    },
    actions: {
        openScan(componentName, title) {
            this.componentName = componentName
            this.title = title
            this.scan = true
        },

        closeScan() {
            this.scan = false
            this.title = null
            this.componentName = null
        },

        setTitle(title) {
            this.title = title
        },
        setComponentName(componentName) {
            this.componentName = componentName
        }
    },

    getters: {
        isScan: (state) => state.scan,
        getTitle: (state) => state.title,
        getComponentName: (state) => state.componentName
    }
})