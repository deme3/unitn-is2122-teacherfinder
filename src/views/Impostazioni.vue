<template>
  <div class="impostazioni tf-box">
    <h1>Impostazioni</h1>
    <UserCard />
  </div>
</template>

<script>
import UserCard from '@/components/UserCard.vue';

export default {
    name: "Impostazioni",
    components: { UserCard }
}
</script>