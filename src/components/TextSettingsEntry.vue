<template>
    <div class="text-settings-entry">
        <div class="description">{{ description }}</div>
        <textarea v-if="multiline" v-model="value" />
        <input v-else type="text" v-model="value" />
    </div>
</template>

<style scoped>
.text-settings-entry {
    margin-bottom: 1.5em;
}

.description {
    font-weight: bold;
    margin: .5em 0;
}
</style>

<script>
export default {
    name: "TextSettingsEntry",
    props: {
        "description": String,
        "default-value": String,
        "multiline": Boolean
    },
    data: function() {
        return {
            value: this.defaultValue
        }
    }
}
</script>