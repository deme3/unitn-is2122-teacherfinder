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
  margin: 0 1em;
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
import { defineExpose, ref } from "vue";

const pictureURL = ref("https://picsum.photos/100");
const firstName = ref("Demetrio");
const lastName = ref("Battaglia");
const nickname = ref("deme3");
//const bio = ref("");

defineExpose({
  pictureURL: String,
  firstName: String,
  lastName: String,
  nickname: String,
  //  bio: String,
});
</script>
