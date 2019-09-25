<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Настройки пользователя</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card>
      <v-card-title>
        <div>
          <div class="text-uppercase grey--text">
            Список подключенных контрагентов
          </div>
          <v-layout class="ma-3" row wrap>
            <v-flex xs12>
              <div
                v-for="partner in me.partner"
                :key="partner.id"
              >
                {{ partner.fullname }} (ИНН: {{ partner.inn }})
              </div>
            </v-flex>
          </v-layout>
        </div>
      </v-card-title>
      <v-card-actions>
        <v-text-field
          v-model="inn"
          :counter="10"
          prepend-icon="assignment"
          name="inn"
          label="ИНН"
          type="text"
          required
        />
        <v-btn icon>
          <v-icon>add_circle_outline</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
export default {
  components: {
  },
  data () {
    return {
      inn: ''
    }
  },
  async asyncData ({ app }) {
    try {
      const client = await app.apolloProvider.defaultClient
      const res = await client.query({
        query: gql`query {
            me {
              email
              partner {
                name
                fullname
                inn
                id
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
  }
}
</script>
