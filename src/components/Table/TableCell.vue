<template>
    <component :is="link ? 'a' : 'td'" style="display: table-cell" class="relative px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 align-middle" :href="link">
        <slot></slot>
    </component>
</template>
<script lang="ts" setup>
    defineProps<{ link?: string }>();
</script>
