<template>
  <v-app>
    <Drawer />
    <v-content>
      <nuxt />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Drawer from '~/components/Drawer'
import Footer from '~/components/Footer'

export default {
  middleware: 'isAuth',
  components: {
    Drawer,
    Footer
  }
}
</script>
