<template>
  <div class="relative inline-block text-left">
    <div class="">
      <button
        class="
          inline-flex
          justify-center
          w-full
          rounded-md
          border border-gray-300
          shadow-sm
          px-4
          py-2
          bg-white
          text-sm
          font-medium
          text-gray-700
          hover:bg-blue-50 hover:text-blue-400 hover:border-blue-200
          h-10
        "
        @click="isOpen = !isOpen"
        @blur="isOpen = false"
      >
        {{ currentOption?.label ?? placeholder ?? "Options" }}
        <svg
          class="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <ul
      v-show="isOpen"
      class="
        absolute
        mt-2
        left-0
        right-0
        mb-4
        bg-white
        rounded-sm
        shadow-lg
        overflow-hidden
      "
    >
      <li
        v-for="(option, index) in options"
        :key="`${index}-${option.value}`"
        class="
          px-3
          py-2
          transition-colors
          duration-300
          hover:bg-blue-50 hover:text-blue-400
          cursor-pointer
          text-sm text-gray-600
        "
        @mousedown.prevent="setOption(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

export interface IOption {
  label: string;
  value: string;
}

export enum Emits {
  Changed = "Changed",
}

export default defineComponent({
  name: "Dropdown",
  props: {
    options: { type: Array as PropType<IOption[]> },
    defaultOption: { type: String },
    placeholder: { type: String },
  },
  setup(props, { emit }) {
    const isOpen = ref(false);
    const currentOption = ref<IOption | undefined>(
      props?.options?.find((x) => x.value === props.defaultOption)
    );

    const setOption = (option: IOption) => {
      currentOption.value = option;
      isOpen.value = false;
      emit(Emits.Changed, option);
    };

    return {
      isOpen,
      currentOption,
      setOption,
    };
  },
});
</script>

<style scoped>
.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>
