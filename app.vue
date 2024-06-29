<template>
    <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </head>
    <div v-if="mapsLoaded">
        <NuxtPage />
    </div>
    <div v-else class="flex justify-center items-center h-screen">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mapsLoaded = ref(false)

onMounted(() => {
    if (globalThis.LoadMaps) {
        globalThis.LoadMaps(() => {
            mapsLoaded.value = true
        })
    } else {
        mapsLoaded.value = true
    }
})
</script>