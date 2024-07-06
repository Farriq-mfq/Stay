<script setup>
import Detail from './components/Detail.vue'
import About from './components/About.vue'
import Logout from './components/Logout.vue'
</script>
<template>
    <div class="grid">
        <div class="col-12">
            <Detail />
            <ul class="flex list-none p-0 w-full flex-column">
                <li>
                    <About />
                </li>
                <li>
                    <Logout />
                </li>
            </ul>
        </div>
    </div>
</template>