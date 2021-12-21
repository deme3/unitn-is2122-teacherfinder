<template>
  <div class="tf-box">
    <h1><BackButton /> Nuovo annuncio</h1>
    <form method="post" @submit.prevent="onSubmit">
      <div class="two-columns">
        <TextEntry description="Titolo" v-model:text="newAd.title" />
        <TextEntry
          description="€/ora"
          v-model:text.number="newAd.price"
          numeric
        />
      </div>
      <TextEntry
        description="Didascalia"
        v-model:text="newAd.description"
        multiline
      />
    </form>
    <section class="action-buttons">
      <button
        :disabled="userInfo.sessionToken === ''"
        @click.prevent="onSubmit"
      >
        Pubblica
      </button>
    </section>
  </div>
</template>

<style scoped>
.action-buttons {
  text-align: right;
}

.two-columns {
  display: flex;
  gap: 1em;
}

.two-columns :first-child {
  width: 100%;
}

.two-columns > :last-child {
  width: 100px;
}

button:disabled {
  opacity: 0.5;
}
</style>

<script setup>
import TextEntry from "@/components/TextEntry.vue";
import BackButton from "@/components/BackButton.vue";
import { reactive, inject } from "vue";
import { useRouter } from "vue-router";

const userInfo = inject("userInfo");
const router = useRouter();

const newAd = reactive({
  title: "",
  description: "",
  price: 0.0,
});

const onSubmit = async () => {
  let submitResult = await fetch("/api/ads/createAd", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionToken: userInfo.sessionToken,
      title: newAd.title,
      description: newAd.description,
      price: newAd.price,
      type: "online",
      lat: -1, // insegnamenti in presenza non implementati
      lon: -1,
    }),
  });

  let dbResult = await submitResult.json();
  if (typeof dbResult._id !== "undefined") {
    router.push({ name: "Annuncio", params: { id: dbResult._id } });
  }
};
</script>
