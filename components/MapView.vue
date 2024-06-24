<template>
    <div :class="{ 'hidden md:block': activeView === 'list' }" class="md:w-1/2 md:pl-4">
        <div id="map" class="h-[calc(100vh-200px)] rounded-lg shadow-lg"></div>
    </div>
</template>

<script>
export default {
    props: {
        activeView: String,
        initMap: Function,
        calculateDirections: Function,
        focusAttraction: Function,
        toggleAttractionInItinerary: Function,
        updateDistances: Function,
        calculateDirections: Function
    },
    mounted() {
        this.initMap();
    },
    watch: {
        activeView(newVal) {
            if (newVal === 'map') {
                this.calculateDirections();
            }
        }
    }
}
</script>

<style scoped>
</style>
