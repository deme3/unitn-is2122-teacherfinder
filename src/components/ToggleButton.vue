<template>
  <div class="toggle-button" @click="toggle">
    <div class="toggle-dot-container">
      <div :class="toggleDotClass"></div>
    </div>
  </div>
</template>

<style scoped>
.toggle-button {
  border: 2px solid var(--border-unique-color);
  background: var(--elements-bg-color);
  width: 32px;
  height: 16px;
  padding: 2px;
  cursor: pointer;
}

.toggle-dot-container {
  position: relative;
}

.toggle-dot {
  position: absolute;
  background: var(--border-unique-color);
  right: 16px;
  width: 16px;
  height: 16px;
  transition: right 0.05s ease-out;
}

.toggled.toggle-dot {
  right: 0;
  transition: right 0.05s ease-out;
}
</style>

<script>
export default {
  name: "ToggleButton",
  data: function () {
    return {
      toggleStatus: false,
    };
  },
  methods: {
    toggle: function () {
      this.toggleStatus = !this.toggleStatus;
    },
  },
  computed: {
    toggleDotClass: function () {
      return "toggle-dot" + (this.toggleStatus ? " toggled" : "");
    },
  },
};
</script>
