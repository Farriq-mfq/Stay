import { defineStore } from 'pinia'
export const useDrawer = defineStore("drawer", {
    state: () => {
        return {
            drawer: false,
            componentName: 'default',
            title: null,
            callback: () => { },
            data: null
        }
    },
    actions: {
        openDrawer(componentName, title, callback, data) {
            this.componentName = componentName
            this.title = title
            this.drawer = true
            this.callback = callback
            this.data = data
        },

        closeDrawer() {
            this.drawer = false
            this.title = null
            this.componentName = null
            this.callback = () => { }
            this.data = null
        },

        setTitle(title) {
            this.title = title
        },
        setComponentName(componentName) {
            this.componentName = componentName
        },
        setCallback(callback) {
            this.callback = callback
        },

        setData(data) {
            this.data = data
        }
    },

    getters: {
        isDrawer: (state) => state.drawer,
        getTitle: (state) => state.title,
        getComponentName: (state) => state.componentName,
        getCallback: (state) => state.callback,
        getData: (state) => state.data
    }
})