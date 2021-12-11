<template>
  <div class="navbar">
    <ul id="nav">
      <li>
        <router-link to="/">Ricerca</router-link>
      </li>
      <li v-if="this.$root.sessionToken !== ''">
        <router-link to="/iscrizioni">Le mie iscrizioni</router-link>
      </li>
      <li v-if="this.$root.sessionToken !== ''">
        <router-link to="/annunci">I miei annunci</router-link>
      </li>
      <li v-if="this.$root.sessionToken !== ''">
        <router-link to="/impostazioni">Impostazioni</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
ul#nav {
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  padding: 0;
  margin: 16px 8px;
}

ul#nav li {
  width: 100%;
  text-align: center;
}

ul#nav a {
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border 0.2s ease-in-out;
}

ul#nav a.router-link-exact-active {
  border-bottom: 2px solid var(--border-unique-color);
}

li a {
  text-decoration: none;
  color: inherit;
}
</style>
