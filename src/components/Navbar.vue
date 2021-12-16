<template>
  <div class="navbar">
    <ul id="nav">
      <li>
        <router-link to="/">
          <img :src="img.ricerca" />
          <div class="text">Ricerca</div>
        </router-link>
      </li>
      <li v-if="this.$root.sessionToken !== ''">
        <router-link to="/iscrizioni">
          <img :src="img.iscrizioni" />
          <div class="text">Le mie iscrizioni</div>
        </router-link>
      </li>
      <li v-if="this.$root.sessionToken !== ''">
        <router-link to="/annunci">
          <img :src="img.annunci" />
          <div class="text">I miei annunci</div>
        </router-link>
      </li>
      <li v-if="this.$root.sessionToken !== ''">
        <router-link to="/impostazioni">
          <img :src="img.impostazioni" />
          <div class="text">Impostazioni</div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
const img = {
  ricerca:
    'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="10" cy="10" r="7"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>',
  iscrizioni:
    'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-notebook" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18"></path><line x1="13" y1="8" x2="15" y2="8"></line><line x1="13" y1="12" x2="15" y2="12"></line></svg>',
  annunci:
    'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-speakerphone" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M18 8a3 3 0 0 1 0 6"></path><path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"></path><path d="M12 8h0l4.524 -3.77a0.9 .9 0 0 1 1.476 .692v12.156a0.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8"></path></svg>',
  impostazioni:
    'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
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
  border-bottom: 2px solid var(--border-unique-strongcolor);
}

li a {
  text-decoration: none;
  color: inherit;
}

img {
  display: none;
}

.text {
  display: inherit;
}

@media only screen and (max-width: 525px) {
  img {
    display: unset;
    height: 30px;
    width: 30px;
  }
  .text {
    display: none;
  }
}

@media (prefers-color-scheme: dark) {
  /* Dark theme styles go here */
  img {
    filter: invert(100%);
  }
}
</style>
