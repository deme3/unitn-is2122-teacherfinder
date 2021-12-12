<template>
  <div class="toggle-settings-entry">
    <div class="description">{{ description }}</div>
    <div class="toggle"><ToggleButton ref="togglebutton" /></div>
  </div>
</template>

<style scoped>
.toggle-settings-entry {
  display: flex;
}

.toggle-settings-entry .description {
  width: 100%;
}

.toggle-settings-entry .toggle {
  width: 48px;
}

.toggle-settings-entry .toggle .toggle-button {
  margin: 0 auto;
}

.toggle-settings-entry:not(:last-child) {
  border-bottom: 2px solid var(--border-unique-color);
  margin-bottom: 1em;
  padding-bottom: 1em;
}
</style>

<script>
import { ref } from "@vue/runtime-core";
import ToggleButton from "@/components/ToggleButton.vue";

export default {
  name: "ToggleSettingsEntry",
  computed: {
    toggleStatus: function () {
      if (this.togglebutton == null) return false;
      return this.togglebutton.toggleStatus;
    },
  },
  props: {
    description: String,
  },
  components: { ToggleButton },
  setup: function () {
    const togglebutton = ref(null);

    return {
      togglebutton,
    };
  },
};
</script>
