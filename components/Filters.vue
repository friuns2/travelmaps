<template>
    <div class="mb-8 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-md">
        <label for="minRatingsCount" class="block text-lg font-medium mb-2">Minimum Ratings Count:</label>
        <div class="flex items-center">
            <input type="range" id="minRatingsCount" v-model="minRatingsCount" min="0" max="1000" step="10"
                class="w-full mr-4 accent-teal-500">
            <span class="text-xl font-semibold">{{ minRatingsCount }}</span>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    minRatingsCount: Number
});
</script>
