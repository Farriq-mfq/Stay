<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};


const showDialogLogout = ref(false)
const hanldeShowDialogLogout = () => {
    showDialogLogout.value = true
}

const $auth = inject('auth')

const handleLogout = () => {
    return $auth.logout({
        redirect: { name: 'login' },
    })
}

</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <!-- <img :src="logoUrl" alt="logo" /> -->
            <span>STAY</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <Button icon="pi pi-sign-out p-link" @click="hanldeShowDialogLogout" severity="danger"
                :label="topbarMenuActive ? 'Logout' : ''" />
        </div>


        <Dialog v-model:visible="showDialogLogout" modal header="Confirmation" :style="{ width: '30rem' }">
            <p class="m-0">
                Yakin ingin keluar dari aplikasi ?
            </p>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Batal" severity="secondary" @click="showDialogLogout = false"></Button>
                <Button type="button" severity="danger" @click.prevent="handleLogout" label="Keluar"></Button>
            </div>
        </Dialog>
    </div>
</template>

<style lang="scss" scoped></style>
