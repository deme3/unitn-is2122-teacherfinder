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

input[type="text"] {
  padding: 8px;
  border: 2px solid black;
  box-shadow: 2px 2px 0 #00000020;
  width: 100%;
  box-sizing: border-box;
  font-size: 11pt;
  outline: none;
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
}

input[type="text"]:focus {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #00000020;
}

input[type="submit"] {
  border: 2px solid black;
  background: white;
  box-shadow: 2px 2px 0 #00000020;
  padding: 8px 16px;
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
}

input[type="submit"]:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #00000020;
  cursor: pointer;
}

input[type="submit"]:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0 #00000020;
  cursor: pointer;
}
</style>
