<template>
  <div class="user-card">
    <div class="user-name">
      <div class="fullname">{{ firstName }} {{ lastName }}</div>
      <div class="nickname">@{{ nickname }}</div>
    </div>
    <div class="user-picture">
      <img :src="pictureURL" />
    </div>
  </div>
</template>

<style scoped>
.user-card {
  margin-top: 1.34em;
  margin-bottom: 1.34em;
  margin-right: 1em;
  margin-left: 1em;
  display: flex;
  gap: 1em;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
}

.user-name {
  width: calc(100% - 100px - 1em);
}

.user-name .fullname {
  font-size: 18pt;
}

.user-name .nickname {
  font-size: 14pt;
  opacity: 0.8;
}

.user-picture {
  min-width: 100px;
  min-height: 100px;
  max-width: 100px;
  max-height: 100px;
  border-radius: 100%;
  overflow: hidden;
}
</style>

<script setup>
import { ref } from "vue";

const pictureURL = ref("https://picsum.photos/100");

defineProps({
  pictureURL: String,
  firstName: String,
  lastName: String,
  nickname: String,
});
</script>
