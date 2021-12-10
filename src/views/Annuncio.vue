<template>
  <div class="annuncio">
    <h1>Annuncio {{ $route.params.uuid }}</h1>
  </div>
</template>

<script>
export default {
  created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        console.log(toParams, previousParams);
        // react to route changes...
      }
    );
  },
};
</script>
