<template>
  <div class="tf-box">
    <h1><BackButton /> Nuovo annuncio</h1>
    <ErrorBox ref="errorBox"/>
    <form method="post" @submit.prevent="onSubmit">
      <div class="two-columns">
        <TextEntry description="Titolo" v-model:text="newAd.title" />
        <TextEntry description="€/ora" v-model:number="newAd.price" numeric />
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
import ErrorBox from "@/components/ErrorBox.vue";
import { reactive, inject, ref } from "vue";
import { useRouter } from "vue-router";

const userInfo = inject("userInfo");
const router = useRouter();
const errorBox = ref(null); // definito nel template

const newAd = reactive({
  title: "",
  description: "",
  price: 0.0,
});

const onSubmit = async () => {
  switch (true) {
    case newAd.title == "":
    case newAd.description == "":
      errorBox.value.showText("Whops, alcuni campi risultano vuoti.");
      return;
    case newAd.price <= 0:
      errorBox.value.showText("Il prezzo che hai inserito è troppo basso.");
      return;
  }

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

  if (!submitResult?.ok) {
    errorBox.value.showText("Errore nella creazione dell'annuncio.");
    console.log(submitResult.text);
    return;
  }

  let dbResult = await submitResult.json();
  if (typeof dbResult._id !== "undefined") {
    router.push({ name: "Annuncio", params: { id: dbResult._id } });
  }
};
</script>
