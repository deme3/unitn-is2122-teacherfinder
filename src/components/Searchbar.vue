<template>
  <form method="post" @submit.prevent="onSubmit">
    <input
      id="searchinput"
      name="searchinput"
      type="text"
      v-model="searchterms"
    />
    <input id="searchok" name="searchok" type="submit" value="Cerca" />
  </form>
</template>

<script setup>
import { defineEmits, defineExpose, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const emit = defineEmits(["search-offer"]);

const searchterms = ref("");

const onSubmit = () => {
  router.push({ name: "Ricerca" });
  emit("search-offer", searchterms.value);
};

defineExpose({
  SearchBar: String,
});
</script>

<style scoped>
header form {
  display: flex;
}

header input[type="text"] {
  margin-right: 4px;
  color: var(--font-color);
  background-color: var(--text-box-bg-color);
}

header input[type="submit"] {
  margin-left: 4px;
}
</style>
