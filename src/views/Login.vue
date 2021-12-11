<template>
    <form method="post" class="tf-box" @submit.prevent="checkCredentials">
        <center>Login</center>
        <TextSettingsEntry description="Username o E-mail" />
        <TextSettingsEntry description="Password" password />
        <ToggleSettingsEntry description="Ricordami" />
        <input type="submit" value="Login" />
    </form>
</template>

<script>
import TextSettingsEntry from '@/components/TextSettingsEntry.vue';
import ToggleSettingsEntry from '@/components/ToggleSettingsEntry.vue';
export default {
    name: "Login",
    components: { TextSettingsEntry, ToggleSettingsEntry },
    methods: {
        checkCredentials() {
            // TO-DO : REST API fetch
        }
    }
}
</script>