<template>
    <div class="flex flex-row border-gray-100 border-solid border-2 rounded">
        <input
            class="mr-auto max-w-xs items-center justify-items-center focus:outline-none border-0 my-0 py-0"
            v-model="text"
            :placeholder="placeholder"
            @input="debounce"
            @keydown.enter="submit"
        />
        <div class="px-2 flex flex-row items-center justify-center cursor-pointer" @click="clear" v-if="clearable">
            <em class="fas fa-times text-xs text-gray-300"></em>
        </div>
        <div class="p-2 bg-gray-100 flex flex-row items-center justify-center cursor-pointer" @click="submit" v-if="withButton">
            <em class="fas fa-search text-gray-500"></em>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { InputEmits as Emits} from './index';

    export default defineComponent({
        name: 'Input',
        props: {
            defaultValue: { type: String },
            placeholder: { type: String },
            clearable: { type: Boolean, default: false },
            withButton: { type: Boolean, default: false },
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
