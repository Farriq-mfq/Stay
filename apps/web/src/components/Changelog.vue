<script setup>
import ChangeLogMarkdown from '@/assets/changelog.md'


</script>
<template>
    <div class="changelog">
        <ChangeLogMarkdown />
    </div>
</template>


<style>
.markdown-body h1 {
    font-size: 2em;
    margin-bottom: 0.5em;
    background: #000 !important;
}

.markdown-body h2 {
    font-size: 1.5em;
    margin-top: 1em;
}

.markdown-body ul {
    list-style: disc;
    padding-left: 2em;
}

.markdown-body li {
    margin-bottom: 0.5em;
}
</style>
