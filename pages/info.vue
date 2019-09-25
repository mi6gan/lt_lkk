<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Список организаций</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card
      v-for="partner in me.partner"
      :key="partner.id"
    >
      <v-layout class="pa-3 ma-3" row wrap>
        <v-flex xs12>
          <v-card-title class="text-uppercase grey--text">
            {{ partner.fullname }}
          </v-card-title>
        </v-flex>
        <v-flex xs12 sm4>
          <div class="caption grey--text">
            ИНН
          </div>
          <div>{{ partner.inn }}</div>
        </v-flex>
        <v-flex xs12 sm4>
          <div class="caption grey--text">
            КПП
          </div>
          <div>{{ partner.kpp }}</div>
        </v-flex>
        <v-flex xs12 sm4>
          <div class="caption grey--text">
            Email
          </div>
          <div>{{ partner.email }}</div>
        </v-flex>
        <v-flex xs12>
          <div class="caption grey--text">
            Адрес юридический
          </div>
          <div>{{ partner.adresU }}</div>
        </v-flex>
        <v-flex xs12>
          <div class="caption grey--text">
            Адрес доставки
          </div>
          <div>{{ partner.adresD }}</div>
        </v-flex>
        <v-flex xs12>
          <v-card-title class="text-uppercase grey--text">
            Банковские реквизиты
          </v-card-title>
        </v-flex>
        <v-flex xs12 sm6>
          <div class="caption grey--text">
            Расч. счёт
          </div>
          <div>{{ partner.rs }}</div>
        </v-flex>
        <v-flex xs12 sm6>
          <div class="caption grey--text">
            Корр. счёт
          </div>
          <div>{{ partner.ks }}</div>
        </v-flex>
        <v-flex xs12 sm6>
          <div class="caption grey--text">
            Банк
          </div>
          <div>{{ partner.bank }}</div>
        </v-flex>
        <v-flex xs12 sm6>
          <div class="caption grey--text">
            БИК
          </div>
          <div>{{ partner.bik }}</div>
        </v-flex>
      </v-layout>
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
      me: []
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
                fullname
                inn
                kpp
                adresU
                adresD
                bank
                bik
                rs
                ks
                email
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
