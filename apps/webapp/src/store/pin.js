import { defineStore } from 'pinia';

export const usePinStore = defineStore('pin', {
    state: () => ({
        showPinConfirmation: false,
        onSuccess: null,
        onError: null,
    }),
    actions: {
        show({
            onSuccess,
            onError,
        }) {
            this.showPinConfirmation = true;
            this.onSuccess = onSuccess;
            this.onError = onError;
        },
        reset() {
            this.showPinConfirmation = false;
            this.onSuccess = null;
            this.onError = null;
        },

        confirm() {
            if (this.onSuccess) {
                this.onSuccess();
                this.reset()
            }
        },

        reject() {
            if (this.onError) {
                this.onError();
                this.reset()
            }
        },
    },
    getters: {
        isVisible: (state) => state.showPinConfirmation,
    },
});

