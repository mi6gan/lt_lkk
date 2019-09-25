<template>
  <div>
    <v-system-bar color="deep-purple darken-3" />
    <v-app-bar flat app>
      <v-app-bar-nav-icon
        class="hidden-lg-and-up"
        @click.stop="drawer=!drawer"
      />

      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <div class="flex-grow-1" />

      <v-btn to="/" icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn to="/settings" icon>
        <v-icon>settings</v-icon>
      </v-btn>
      <v-btn @click="onLogout">
        <span>Выйти</span>
        <v-icon right>
          exit_to_app
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      id="app-drawer"
      v-model="drawer"
      fixed
      color="secondary"
      dark
      app
    >
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="LT_logo-color-RGB-02.png">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>ООО "Лизинг-Трейд"</v-list-item-title>
            <v-list-item-subtitle>Действуй сейчас</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-divider />
      <v-list dense>
        <v-list-item
          v-for="(link, i) in $store.state.navlinks"
          :key="i"
          :to="link.to"
          router
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="link.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      responsive: false,
      drawer: true
    }
  },
  computed: {
    title () {
      const searchpath = this.$route.path.split('/')[1] || ''
      const foundTitle = this.$store.state.navlinks.find(el => el.to === '/' + searchpath)
      if (foundTitle) { return foundTitle.title } else { return this.$route.path.split('/') }
    }
  },
  methods: {
    async onLogout () {
      await this.$apolloHelpers.onLogout()
      this.$store.commit('user/clearUser')
      this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>
