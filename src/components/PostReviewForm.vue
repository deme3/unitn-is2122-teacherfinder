<template>
  <div>
    <h1>Lascia una recensione</h1>
    <div class="tf-box review-form">
      <form method="post" @submit.prevent="onSubmit">
        <TextEntry
          description="Recensione"
          v-model:text="review.explanation"
          multiline
        />

        <div class="bottom-bar">
          <div class="user-info">
            <div class="user-info-label">Pubblica come:</div>
            <div class="user-contact">
              {{ userInfo.firstName }} {{ userInfo.lastName }} (<b
                >@{{ userInfo.nickname }}</b
              >)
            </div>
          </div>
          <div class="action-bar">
            <RatingStars
              class="rating-stars"
              :interactive="true"
              v-model:rating="review.rating"
            />
            <input type="submit" value="Pubblica" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.bottom-bar {
  display: flex;
  align-items: center;
}

.bottom-bar > div {
  width: 50%;
}

.action-bar {
  display: flex;
  text-align: right;
  gap: 1.5em;
  flex-wrap: wrap;
  justify-content: right;
  align-content: top;
}

.action-bar > * {
  display: inline-block;
}

.user-info-label,
.user-contact {
  font-style: italic;
}

.rating-stars {
  white-space: nowrap;
}
</style>

<script setup>
import TextEntry from "@/components/TextEntry.vue";
import RatingStars from "@/components/RatingStars.vue";
import { inject, reactive } from "vue";

let userInfo = inject("userInfo");
let review = reactive({
  rating: 1,
  explanation: "",
});

const props = defineProps({
  adId: String,
});
const emit = defineEmits(["reviewSubmit"]);

const onSubmit = async () => {
  let postResult = await fetch(`/api/reviews/postReview`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionToken: userInfo.sessionToken,
      adId: props.adId,
      rating: review.rating,
      explanation: review.explanation,
    }),
  });

  if (postResult.ok) {
    let postJSON = await postResult.json();
    review.rating = 1;
    review.explanation = "";
    emit("reviewSubmit", postJSON);
  } else {
    // TO-DO : Error
  }
};
</script>
