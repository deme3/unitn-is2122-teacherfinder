<template>
  <div
    :class="ratingClass"
    @mouseleave="onMouseLeave"
    @mouseenter="onMouseEnter"
  >
    <div
      class="star"
      v-for="n in 5"
      :key="n"
      @mouseover="starOnMouseOver(n)"
      @click="starOnClick(n)"
    />
  </div>
</template>

<style scoped>
.star-rating {
  margin-top: 10px;
}

.star {
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-star" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="gold" fill="gold" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" fill="gold"></path></svg>');
  background-size: cover;
  display: inline-block;
  margin: 0 4px;
}

.star:first-child {
  margin-left: 0;
}

.star-rating.interactive .star {
  cursor: pointer;
}

.star-rating.star-0 .star {
  display: none;
}

.star-rating.star-0:after {
  content: "Nessuna valutazione";
  vertical-align: top;
  line-height: 1.1em;
  color: goldenrod;
}

.star-rating.star-1 .star:not(:first-child),
.star-rating.star-2 .star:not(:first-child, :nth-child(2)),
.star-rating.star-3 .star:not(:first-child, :nth-child(2), :nth-child(3)),
.star-rating.star-4 .star:nth-child(5) {
  opacity: 0.2;
}
</style>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  rating: Number,
  interactive: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:rating"]);

let rating = ref(props.rating);
let value = computed({
  get: () => props.rating,
  set: (value) => emit("update:rating", value),
});
let hovering = ref(false);

const ratingClass = computed(() => {
  if (!props.interactive) {
    return `star-rating star-${props.rating}`;
  } else {
    if (hovering.value) return `star-rating star-${rating.value} interactive`;
    else return `star-rating star-${value.value} interactive`;
  }
});

const onMouseEnter = function () {
  hovering.value = true;
};

const onMouseLeave = function () {
  hovering.value = false;
};

const starOnMouseOver = function (n) {
  if (props.interactive) {
    rating.value = n;
  }
};

const starOnClick = function (n) {
  if (props.interactive) {
    value.value = n;
  }
};
</script>
