<template>
  <div class="navbar">
    <ul id="nav">
      <li>
        <router-link to="/">Ricerca</router-link>
      </li>
      <li>
        <router-link to="/iscrizioni">Le mie iscrizioni</router-link>
      </li>
      <li>
        <router-link to="/annunci">I miei annunci</router-link>
      </li>
      <li>
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
  list-style-type: none;
  padding: 0;
  margin: 16px 8px;
}

ul#nav li {
  width: 100%;
  text-align: center;
  cursor: pointer;
}

ul#nav li:only-child {
  border-bottom: 2px solid transparent;
  transition: border 0.2s ease-in-out;
}

ul#nav li.current:only-child {
  border-bottom: 2px solid black;
}
</style>
