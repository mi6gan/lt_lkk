<template>
  <v-app>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">
      Вернуться на главную
    </NuxtLink>
  </v-app>
</template>

<script>
export default {
  layout: 'login',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  data () {
    return {
      pageNotFound: '404 Не найдено',
      otherError: 'Упс! Произошла ошибка'
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
