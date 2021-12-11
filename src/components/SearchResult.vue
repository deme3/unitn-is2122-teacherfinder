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
  border: 2px solid var(--border-unique-color);
  box-shadow: 5px 5px 0 var(--border-unique-shadow);
  margin: 16px 8px;
  padding: 16px 24px;
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
  background: var(--elements-bg-color);
}

.sr-info:hover {
  box-shadow: 2px 2px 0 var(--border-unique-shadow);
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
  width: 10px;
  height: 10px;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 6 6"><path d="M 3 0 L 2 2 L 0 2 L 1.5 3.5 L 0.5 6 L 3 4.5 L 5.5 6 L 4.5 3.5 L 6 2 L 4 2 L 3 0" fill="gold"></path></svg>');
  background-size: cover;
  display: inline-block;
  margin: 0 4px;
}

.star:first-child {
  margin-left: 0;
}

.sr-grading.star-1 .star:not(:first-child),
.sr-grading.star-2 .star:not(:first-child, :nth-child(2)),
.sr-grading.star-3 .star:not(:first-child, :nth-child(2), :nth-child(3)),
.sr-grading.star-4 .star:nth-child(4),
.sr-grading .star-4 .star:last-child {
  opacity: 0.2;
}
</style>
