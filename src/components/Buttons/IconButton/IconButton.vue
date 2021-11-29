<template>
    <button
        :class="{
            'text-blue-400': isActive,
        }"
        class="rounded-md color border border-gray-300 text-gray-600 w-12 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-400 icon-button h-10 box-border"
    >
        <slot></slot>
    </button>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'IconButton',
        props: {
            isActive: { type: Boolean, default: false },
        },
    });
</script>

<style scoped>
    .icon-button {
        line-height: 1;
        min-height: 40px;
        box-sizing: border-box;
    }
</style>
