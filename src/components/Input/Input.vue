<template>
    <div>
        <label for="search" class="sr-only">Search</label>
        <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center" aria-hidden="true">
                <search-icon class="mr-3 h-4 w-4 text-gray-400 cursor-pointer" aria-hidden="true" @click="submit" v-if="withButton" />
            </div>
            <input
                type="text"
                name="search"
                id="search"
                class="block w-full pl-9 sm:text-sm border border-gray-300 dark:border-dark-200 dark:bg-dark-400 dark:text-gray-300 rounded-md dark:placeholder:text-gray-200"
                :class="inputClass"
                v-model="text"
                :placeholder="placeholder"
                @input="debounce"
                @keydown.enter="submit"
                @emptied="clear"
            />
            <div class="absolute inset-y-0 right-0 pl-3 flex items-center" aria-hidden="true">
                <x-icon class="mr-3 h-4 w-4 text-gray-400 cursor-pointer" aria-hidden="true" @click="clear" v-if="clearable" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { InputEmits as Emits } from './index';
    import { SearchIcon, XIcon } from '@heroicons/vue/solid';

    export default defineComponent({
        name: 'Input',
        components: {
            SearchIcon,
            XIcon,
        },
        props: {
            defaultValue: { type: String },
            placeholder: { type: String },
            clearable: { type: Boolean, default: false },
            withButton: { type: Boolean, default: false },
            inputClass: { type: Object, default: () => ({}) },
        },
        setup(props, { emit }) {
            const text = ref(props.defaultValue);
            const debouncedSearchValue = ref<string>();
            // eslint-disable-next-line no-undef
            let timeout: any;

            const debounce = () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    emit(Emits.TextChanged, text.value);
                    debouncedSearchValue.value = text.value;
                }, 300);
            };

            const clear = () => {
                text.value = undefined;
                emit(Emits.TextChanged, text.value);
                emit('clear', text.value);
            };

            const submit = () => {
                emit(Emits.ButtonClicked, text.value);
            };

            return {
                text,
                debounce,
                submit,
                clear,
                Emits,
            };
        },
    });
</script>
<style>
    .table tr {
        background: gray;
    }
</style>
