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

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      searchterms: "",
    };
  },
  methods: {
    onSubmit() {
      this.$router.push({ name: "Ricerca" });
      this.$emit("search-offer", this.searchterms);
    },
  },
};
</script>

<style scoped>
header form {
  display: flex;
}

header input {
  margin: 0 4px;
}
</style>
