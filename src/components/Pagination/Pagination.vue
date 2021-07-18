<template>
    <div class="flex-1 flex justify-between sm:hidden">
        <div
            v-if="currentPage !== 1"
            class="
                relative
                inline-flex
                items-center
                px-4
                py-2
                border border-gray-300
                text-sm
                font-medium
                rounded-md
                text-gray-700
                bg-white
                hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500
            "
            @click="previous"
        >
            Previous
        </div>
        <div
            v-if="currentPage !== totalPages"
            class="
                ml-3
                relative
                inline-flex
                items-center
                px-4
                py-2
                border border-gray-300
                text-sm
                font-medium
                rounded-md
                text-gray-700
                bg-white
                hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500
            "
            @click="next"
        >
            Next
        </div>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
            <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                to
                <span class="font-medium"> {{ currentPage * pageSize > total ? total : currentPage * pageSize }}</span>
                of
                <span class="font-medium">{{ total }}</span>
                results
            </p>
        </div>
        <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <div
                    v-if="currentPage !== 1"
                    class="
                        relative
                        inline-flex
                        items-center
                        px-2
                        py-2
                        rounded-l-md
                        border border-gray-300
                        bg-white
                        text-sm
                        font-medium
                        text-gray-500
                        hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500
                    "
                    @click="previous"
                >
                    <span class="sr-only">Previous</span>
                    <!-- Heroicon name: solid/chevron-left -->
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                            fill-rule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <!-- Current: "z-10 bg-blue-50 border-blue-500 text-blue-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->

                <div
                    v-if="pagesToShow[0] !== 1"
                    class="
                        z-10
                        bg-white
                        border-gray-300
                        text-gray-500
                        relative
                        inline-flex
                        items-center
                        px-4
                        py-2
                        border
                        text-sm
                        font-medium
                        hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500
                        cursor-pointer
                    "
                    @click="goToPage(1)"
                >
                    1
                </div>

                <div
                    v-if="pagesToShow[0] !== 1"
                    class="
                        z-10
                        bg-white
                        border-gray-300
                        text-gray-500
                        relative
                        inline-flex
                        items-center
                        px-4
                        py-2
                        border
                        text-sm
                        font-medium
                        hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500
                        cursor-pointer
                    "
                >
                    ...
                </div>

                <div
                    v-for="page in pagesToShow"
                    class="
                        z-10
                        bg-white
                        border-gray-300
                        text-gray-500
                        relative
                        inline-flex
                        items-center
                        px-4
                        py-2
                        border
                        text-sm
                        font-medium
                        hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500
                        cursor-pointer
                    "
                    :class="{
                        'bg-blue-50 border-blue-300 text-blue-500': page === currentPage,
                    }"
                    @click="goToPage(page)"
                >
                    {{ page }}
                </div>

                <div
                    v-if="pagesToShow[pagesToShow.length - 1] !== totalPages"
                    class="
                        z-10
                        bg-white
                        border-gray-300
                        text-gray-500
                        relative
                        inline-flex
                        items-center
                        px-4
                        py-2
                        border
                        text-sm
                        font-medium
                        hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500
                        cursor-pointer
                    "
                >
                    ...
                </div>

                <div
                    v-if="pagesToShow[pagesToShow.length - 1] !== totalPages"
                    class="
                        z-10
                        bg-white
                        border-gray-300
                        text-gray-500
                        relative
                        inline-flex
                        items-center
                        px-4
                        py-2
                        border
                        text-sm
                        font-medium
                        hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500
                        cursor-pointer
                    "
                    @click="goToPage(totalPages)"
                >
                    {{ totalPages }}
                </div>

                <div
                    v-if="currentPage !== totalPages"
                    class="
                        relative
                        inline-flex
                        items-center
                        px-2
                        py-2
                        rounded-r-md
                        border border-gray-300
                        bg-white
                        text-sm
                        font-medium
                        text-gray-500
                        hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500
                        cursor-pointer
                    "
                    @click="next"
                >
                    <span class="sr-only">Next</span>
                    <!-- Heroicon name: solid/chevron-right -->
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
            </nav>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent } from 'vue';
    import { PaginationEmits as Emits } from './'

    const range = (start: number, end: number) => {
        const arr = [];
        for (let i = start; i <= end; i++) {
            arr.push(i);
        }
        return arr;
    };

    export default defineComponent({
        name: 'Pagination',
        emits: Object.values(Emits),
        props: {
            pageSize: { type: Number },
            currentPage: { type: Number },
            total: { type: Number },
        },
        setup(props, { emit }) {
            const offset = 2;
            const totalPages = computed(() => {
                if (!props.total || !props.pageSize) return 1;
                return Math.ceil(props.total / props.pageSize);
            });

            const pagesToShow = computed(() => {
                if (!props.currentPage || props.currentPage < 2 * offset + 1) return range(1, 2 * offset + 1);
                if (props.currentPage > totalPages.value - 2 * offset - 1) return range(totalPages.value - 2 * offset - 1, totalPages.value);
                return range(props.currentPage - 2, props.currentPage + 2);
            });

            const goToPage = (page: number) => {
                emit(Emits.PageChanged, page);
            };

            const next = (page: number) => {
                goToPage(props.currentPage ?? +1);
            };

            const previous = (page: number) => {
                goToPage(props.currentPage ?? -1);
            };

            return {
                pagesToShow,
                goToPage,
                totalPages,
                offset,
                next,
                previous
            };
        },
    });
</script>

<style scoped></style>
