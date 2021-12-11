<template>
  <div class="sr-info" @click="onClick">
    <div class="sr-title">{{ title }}</div>
    <div class="sr-price">Prezzo: {{ prettyPrice }}€/ora</div>
    <div :class="gradingClass">
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchResult",
  props: { title: String, price: Number, grading: Number, uuid: String },
  computed: {
    gradingClass: function () {
      return "sr-grading star-" + this.grading;
    },
    prettyPrice: function () {
      return this.price.toFixed(2);
    },
  },
  methods: {
    onClick() {
      this.$router.push({ name: "Annuncio", params: { uuid: this.uuid } });
      this.$emit("offer-click", this.uuid);
    },
  },
};
</script>

<style scoped>
.sr-info {
  border: 2px solid black;
  box-shadow: 5px 5px 0 #00000020;
  margin: 16px 8px;
  padding: 16px 24px;
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
  background: white;
}

.sr-info:hover {
  box-shadow: 2px 2px 0 #00000020;
  transform: translate(2px, 2px);
  cursor: pointer;
}

.sr-info .sr-title {
  font-size: 16pt;
}

.sr-grading {
  margin-top: 8px;
}

.star {
  width: 8px;
  height: 8px;
  background: black;
  border-radius: 100%;
  display: inline-block;
  margin: 0 4px;
}

.star:first-child {
  margin-left: 0;
}

.sr-grading.star-1 .star:not(:first-child) {
  display: none;
}

.sr-grading.star-2 .star:not(:first-child, :nth-child(2)) {
  display: none;
}

.sr-grading.star-3 .star:not(:first-child, :nth-child(2), :nth-child(3)) {
  display: none;
}

.sr-grading.star-4 .star:nth-child(4),
.sr-grading .star-4 .star:last-child {
  display: none;
}
</style>
