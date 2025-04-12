import { defineStore } from 'pinia';
import {config} from '@/config'

export const useTheme = defineStore('theme', {
    state: () => ({
        themes: [
            {
                "name": "arya-blue",
                "label": "Arya Blue",
                "color": "#2196F3"
            },
            {
                "name": "arya-green",
                "label": "Arya Green",
                "color": "#4CAF50"
            },
            {
                "name": "arya-orange",
                "label": "Arya Orange",
                "color": "#FF9800"
            },
            {
                "name": "arya-purple",
                "label": "Arya Purple",
                "color": "#9C27B0"
            },
            {
                "name": "aura-dark-amber",
                "label": "Aura Dark Amber",
                "color": "#FFA000"
            },
            {
                "name": "aura-dark-blue",
                "label": "Aura Dark Blue",
                "color": "#1976D2"
            },
            {
                "name": "aura-dark-cyan",
                "label": "Aura Dark Cyan",
                "color": "#0097A7"
            },
            {
                "name": "aura-dark-green",
                "label": "Aura Dark Green",
                "color": "#388E3C"
            },
            {
                "name": "aura-dark-indigo",
                "label": "Aura Dark Indigo",
                "color": "#3949AB"
            },
            {
                "name": "aura-dark-lime",
                "label": "Aura Dark Lime",
                "color": "#AFB42B"
            },
            {
                "name": "aura-dark-noir",
                "label": "Aura Dark Noir",
                "color": "#424242"
            },
            {
                "name": "aura-dark-pink",
                "label": "Aura Dark Pink",
                "color": "#C2185B"
            },
            {
                "name": "aura-dark-purple",
                "label": "Aura Dark Purple",
                "color": "#7B1FA2"
            },
            {
                "name": "aura-dark-teal",
                "label": "Aura Dark Teal",
                "color": "#00796B"
            },
            {
                "name": "aura-light-amber",
                "label": "Aura Light Amber",
                "color": "#FFB300"
            },
            {
                "name": "aura-light-blue",
                "label": "Aura Light Blue",
                "color": "#42A5F5"
            },
            {
                "name": "aura-light-cyan",
                "label": "Aura Light Cyan",
                "color": "#4DD0E1"
            },
            {
                "name": "aura-light-green",
                "label": "Aura Light Green",
                "color": "#66BB6A"
            },
            {
                "name": "aura-light-indigo",
                "label": "Aura Light Indigo",
                "color": "#7986CB"
            },
            {
                "name": "aura-light-lime",
                "label": "Aura Light Lime",
                "color": "#CDDC39"
            },
            {
                "name": "aura-light-noir",
                "label": "Aura Light Noir",
                "color": "#757575"
            },
            {
                "name": "aura-light-pink",
                "label": "Aura Light Pink",
                "color": "#EC407A"
            },
            {
                "name": "aura-light-purple",
                "label": "Aura Light Purple",
                "color": "#AB47BC"
            },
            {
                "name": "aura-light-teal",
                "label": "Aura Light Teal",
                "color": "#26A69A"
            },
            {
                "name": "bootstrap4-dark-blue",
                "label": "Bootstrap4 Dark Blue",
                "color": "#0D6EFD"
            },
            {
                "name": "bootstrap4-dark-purple",
                "label": "Bootstrap4 Dark Purple",
                "color": "#6F42C1"
            },
            {
                "name": "bootstrap4-light-blue",
                "label": "Bootstrap4 Light Blue",
                "color": "#0DCAF0"
            },
            {
                "name": "bootstrap4-light-purple",
                "label": "Bootstrap4 Light Purple",
                "color": "#E685B5"
            },
            {
                "name": "fluent-light",
                "label": "Fluent Light",
                "color": "#0078D4"
            },
            {
                "name": "lara-dark-amber",
                "label": "Lara Dark Amber",
                "color": "#FFA000"
            },
            {
                "name": "lara-dark-blue",
                "label": "Lara Dark Blue",
                "color": "#1976D2"
            },
            {
                "name": "lara-dark-cyan",
                "label": "Lara Dark Cyan",
                "color": "#0097A7"
            },
            {
                "name": "lara-dark-green",
                "label": "Lara Dark Green",
                "color": "#388E3C"
            },
            {
                "name": "lara-dark-indigo",
                "label": "Lara Dark Indigo",
                "color": "#3949AB"
            },
            {
                "name": "lara-dark-pink",
                "label": "Lara Dark Pink",
                "color": "#C2185B"
            },
            {
                "name": "lara-dark-purple",
                "label": "Lara Dark Purple",
                "color": "#7B1FA2"
            },
            {
                "name": "lara-dark-teal",
                "label": "Lara Dark Teal",
                "color": "#00796B"
            },
            {
                "name": "lara-light-amber",
                "label": "Lara Light Amber",
                "color": "#FFB300"
            },
            {
                "name": "lara-light-blue",
                "label": "Lara Light Blue",
                "color": "#42A5F5"
            },
            {
                "name": "lara-light-cyan",
                "label": "Lara Light Cyan",
                "color": "#4DD0E1"
            },
            {
                "name": "lara-light-green",
                "label": "Lara Light Green",
                "color": "#66BB6A"
            },
            {
                "name": "lara-light-indigo",
                "label": "Lara Light Indigo",
                "color": "#7986CB"
            },
            {
                "name": "lara-light-pink",
                "label": "Lara Light Pink",
                "color": "#EC407A"
            },
            {
                "name": "lara-light-purple",
                "label": "Lara Light Purple",
                "color": "#AB47BC"
            },
            {
                "name": "lara-light-teal",
                "label": "Lara Light Teal",
                "color": "#26A69A"
            },
            {
                "name": "luna-amber",
                "label": "Luna Amber",
                "color": "#FFA000"
            },
            {
                "name": "luna-blue",
                "label": "Luna Blue",
                "color": "#2196F3"
            },
            {
                "name": "luna-green",
                "label": "Luna Green",
                "color": "#4CAF50"
            },
            {
                "name": "luna-pink",
                "label": "Luna Pink",
                "color": "#E91E63"
            },
            {
                "name": "md-dark-deeppurple",
                "label": "Md Dark Deeppurple",
                "color": "#673AB7"
            },
            {
                "name": "md-dark-indigo",
                "label": "Md Dark Indigo",
                "color": "#3F51B5"
            },
            {
                "name": "md-light-deeppurple",
                "label": "Md Light Deeppurple",
                "color": "#9575CD"
            },
            {
                "name": "md-light-indigo",
                "label": "Md Light Indigo",
                "color": "#7986CB"
            },
            {
                "name": "mdc-dark-deeppurple",
                "label": "Mdc Dark Deeppurple",
                "color": "#673AB7"
            },
            {
                "name": "mdc-dark-indigo",
                "label": "Mdc Dark Indigo",
                "color": "#3F51B5"
            },
            {
                "name": "mdc-light-deeppurple",
                "label": "Mdc Light Deeppurple",
                "color": "#9575CD"
            },
            {
                "name": "mdc-light-indigo",
                "label": "Mdc Light Indigo",
                "color": "#7986CB"
            },
            {
                "name": "nova",
                "label": "Nova",
                "color": "#2196F3"
            },
            {
                "name": "nova-accent",
                "label": "Nova Accent",
                "color": "#FF4081"
            },
            {
                "name": "nova-alt",
                "label": "Nova Alt",
                "color": "#4CAF50"
            },
            {
                "name": "nova-vue",
                "label": "Nova Vue",
                "color": "#42B883"
            },
            {
                "name": "rhea",
                "label": "Rhea",
                "color": "#2196F3"
            },
            {
                "name": "saga-blue",
                "label": "Saga Blue",
                "color": "#2196F3"
            },
            {
                "name": "saga-green",
                "label": "Saga Green",
                "color": "#4CAF50"
            },
            {
                "name": "saga-orange",
                "label": "Saga Orange",
                "color": "#FF9800"
            },
            {
                "name": "saga-purple",
                "label": "Saga Purple",
                "color": "#9C27B0"
            },
            {
                "name": "tailwind-light",
                "label": "Tailwind Light",
                "color": "#3B82F6"
            },
            {
                "name": "vela-blue",
                "label": "Vela Blue",
                "color": "#2196F3"
            },
            {
                "name": "vela-green",
                "label": "Vela Green",
                "color": "#4CAF50"
            },
            {
                "name": "vela-orange",
                "label": "Vela Orange",
                "color": "#FF9800"
            },
            {
                "name": "vela-purple",
                "label": "Vela Purple",
                "color": "#9C27B0"
            }
        ],
        currentTheme: localStorage.getItem(`${config.STORAGE_KEY}/theme`) || 'aura-light-blue',
    }),
    actions: {
        setTheme(themeName) {
            this.currentTheme = themeName;
            localStorage.setItem(`${config.STORAGE_KEY}/theme`, themeName);
        }
    },
    getters: {
        getThemes: (state) => state.themes,
        getCurrentTheme: (state) => state.currentTheme,
    },
}); 