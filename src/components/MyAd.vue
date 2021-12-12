<template>
  <div class="my-ad tf-box hoverable">
    <div class="title">{{ title }}</div>
    <div class="price">Prezzo: {{ price.toFixed(2) }}€/ora</div>
    <div class="description">{{ description }}</div>
    <div class="enrolments">
      <div class="active">{{ activeEnrolments }} iscritti</div>
      <div class="pending">{{ pendingEnrolments }} richieste in attesa</div>
    </div>
  </div>
</template>

<style scoped>
.my-ad .title {
  font-size: 16pt;
}

.my-ad .enrolments {
  display: flex;
  margin-top: 16px;
}

.my-ad .enrolments > div {
  width: 50%;
  text-align: center;
}
</style>

<script>
export default {
  name: "MyAd",
  props: {
    title: String,
    price: Number,
    description: String,
  },
  computed: {
    prettyPrice() {
      return this.price.toFixed(2);
    },
    enrolments() {
      return 17;
    },
    activeEnrolments() {
      return 9;
    },
    pendingEnrolments() {
      return this.enrolments - this.activeEnrolments;
    },
  },
};
</script>
