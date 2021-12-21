<template>
  <div class="annunci">
    <h1>I miei annunci</h1>
    <div class="tf-box hoverable clickable new-ad-btn" @click="router.push({ name: 'Pubblica annuncio' })">
      <div class="plus"></div>
      Nuovo annuncio
    </div>
    <SearchResult
      v-for="ad in ads"
      :key="ad._id"
      :id="ad._id"
      :title="ad.title"
      :price="ad.price"
      :rating="ad.rating"
    />
  </div>
</template>

<style scoped>
.plus {
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 9 9"><path d="M 0 4 L 0 5 L 4 5 L 4 9 L 5 9 L 5 5 L 9 5 L 9 4 L 5 4 L 5 0 L 4 0 L 4 4 L 0 4" fill="black"></path></svg>');
  background-repeat: no-repeat;
  background-size: 12px 12px;
  background-position: center;
  margin-top: -1px;
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: middle;
}

.new-ad-btn {
  text-align: center;
  font-weight: bold;
  margin: 0 auto;
}
</style>

<script setup>
import SearchResult from "@/components/SearchResult.vue";
import { watch, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  userInfo: {
    _id: String
  },
});

let ads = ref([]);

watch(() => props.userInfo._id, async () => {
  if(props.userInfo._id !== "") {
    await loadAds();
  }
});

async function loadAds() {
  let adsFetch = await fetch(`/api/ads/list/${props.userInfo._id}`);

  if(adsFetch.ok) {
    ads.value = await adsFetch.json();
  }
}

if(props.userInfo._id !== "") loadAds();

document.title = "TeacherFinder – I miei annunci";
</script>