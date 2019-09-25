<template>
  <v-container>
    <v-card
      v-for="partner in me.partner"
      :key="partner.id"
      class="ma-3"
    >
      <v-card-title class="text-uppercase grey--text">
        {{ partner.name }}
      </v-card-title>
      <v-card
        v-for="project in partner.projects"
        :key="project.id"
        :to="'/projects/'+project.id"
        class="card-dl"
      >
        <v-layout :class="`pa-3 mx-1 contract ${project.status}`" row wrap>
          <v-flex xs4 sm2>
            <div class="right">
              <v-chip :color="statusColors[project.status]" class="white--text my-2 caption" small>
                {{ project.status }}
              </v-chip>
            </div>
          </v-flex>
          <v-flex xs12 sm3>
            <div class="caption grey--text">
              Дата проекта
            </div>
            <div>{{ new Date(project.date).toLocaleDateString('ru-RU') }}</div>
          </v-flex>
          <v-flex xs12 sm3>
            <div class="caption grey--text">
              Продукт
            </div>
            <div>{{ project.product }}</div>
          </v-flex>
          <v-flex xs12 sm4>
            <div class="caption grey--text">
              Менеджер
            </div>
            <div>{{ project.manager }}</div>
          </v-flex>
        </v-layout>
        <v-divider />
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
export default {
  data () {
    return {
      statusColors: {
        'СозданиеДЛ': '#3cd1c2'
      }
    }
  },
  async asyncData ({ app }) {
    try {
      const client = await app.apolloProvider.defaultClient
      const res = await client.query({
        query: gql`query {
            me {
              partner {
                name
                id
                projects {
                  id
                  date
                  status
                  manager
                  product
                }
              }
            }
          }`
      }).then(({ data }) => data && data.me)
      return { me: res }
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
      /* eslint-enable no-console */
    }
  },
  methods: {
    removeChip (item) {
      this.statusChips.splice(this.statusChips.indexOf(item), 1)
      this.statusChips = [...this.statusChips]
    }
  }
}
</script>

<style>
.contract.СозданиеДЛ{
  border-left: 4px solid #3cd1c2;
}
.contract.Согласование{
  border-left: 4px solid #ffaa2c;
}
.contract.Закрыт{
  border-left: 4px solid #f83e70;
}
.contract.Профинансирован{
  border-left: 4px solid #3af1a2;
}
</style>
