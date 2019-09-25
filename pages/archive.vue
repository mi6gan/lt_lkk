<template>
  <v-container>
    <v-toolbar flat color="grey lighten-4">
      <v-combobox
        v-model="statusChips"
        :items="statusList"
        hide-selected
        label="Отбор по статусам"
        small-chips
        clearable
        multiple
      >
        <template v-slot:selection="data">
          <v-chip
            :class="`${data.item} white--text my-2 caption`"
            :selected="data.selected"
            close
            small
            @input="removeChip(data.item)"
          >
            {{ data.item }}
          </v-chip>
        </template>
      </v-combobox>
      <v-spacer />
      <v-text-field
        v-model="search"
        hide-details
        label="Поиск.."
        append-icon="search"
        clearable
      />
    </v-toolbar>
    <v-card
      v-for="partner in flr_contracts"
      :key="partner.id"
      class="ma-3"
    >
      <v-card-title class="text-uppercase grey--text">
        {{ partner.name }}
      </v-card-title>
      <v-layout row wrap>
        <v-flex xs12 md3>
          <v-btn
            v-if="!partner.as"
            small
            color="grey"
            target="_blank"
            @click="getAs(partner.id)"
          >
            Сформировать акт-сверки
          </v-btn>
          <v-btn
            v-if="partner.as"
            :href="`https://cabinet.leasing-trade.ru:4000/download?id=${partner.as}&type=as&name=LTas`"
            small
            color="primary"
            target="_blank"
          >
            Скачать акт-сверки (PDF)
          </v-btn>
        </v-flex>
        <v-flex xs9>
          <v-btn text icon color="grey" @click="checkAllContracts(partner.id, true)">
            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
          </v-btn>
          <v-btn text icon color="grey" @click="checkAllContracts(partner.id, false)">
            <v-icon>mdi-checkbox-blank-circle-outline</v-icon>
          </v-btn>
          <v-card
            v-for="contract in partner.contracts"
            :key="contract.id"
            class="card-dl"
            @click="checkContract(contract.id)"
          >
            <v-layout :class="`pa-1 contract ${contract.status}`" row wrap>
              <v-flex xs8>
                <div class="caption grey--text">
                  Договор лизинга
                </div>
                <div>
                  <v-icon v-if="contract.check" small>
                    mdi-checkbox-marked-circle-outline
                  </v-icon>
                  <v-icon v-else small>
                    mdi-checkbox-blank-circle-outline
                  </v-icon>
                  {{ contract.name }} от {{ new Date(contract.date).toLocaleDateString('ru-RU') }}
                </div>
              </v-flex>
              <v-flex xs4>
                <div class="right">
                  <v-chip :class="`${contract.status} white--text my-2 caption`" small>
                    {{ contract.status }}
                  </v-chip>
                </div>
              </v-flex>
            </v-layout>
            <v-divider />
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
export default {
  data () {
    return {
      search: '',
      statusChips: '',
      statusList: ['Действует', 'Закрыт', 'Профинансирован', 'Согласование']
    }
  },
  computed: {
    flr_contracts () {
      const search = this.search
      const partnerArray = this.me.partner.map((partnerel) => {
        return {
          name: partnerel.name,
          id: partnerel.id,
          as: partnerel.as,
          contracts: partnerel.contracts.filter((entry) => {
            if (this.statusChips.length > 0 && !this.statusChips.find(elem => elem === entry.status)) {
              return false
            }
            if (entry.name.includes(search)) { return true }
          })
        }
      })
      return partnerArray
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
                contracts {
                  id
                  name
                  date
                  status
                  summ
                  properties {
                    name
                    vin
                    sign
                  }
                }
              }  
            }
          }`
      }).then(({ data }) => data && data.me)
      res.partner.forEach((partElement) => {
        partElement.contracts.forEach((contrElement) => {
          contrElement.check = false
        })
      })
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
    },
    async getAs (partnerId) {
      try {
        const res = await this.$apollo.mutate({
          mutation: gql`mutation ($partnerId: String!) {
            getActSverki(partnerId: $partnerId)
          }`,
          variables: {
            partnerId
          }
        }).then(({ data }) => data && data.getActSverki)
        /* eslint-disable no-console */
        console.log(this.me.partner)
        /* eslint-enable no-console */
        this.me.partner.forEach((element) => {
          if (element.id === partnerId) { element.as = res }
        })
        const tempSearch = this.search
        this.search = ' '
        this.search = tempSearch
      } catch (e) {
        /* eslint-disable no-console */
        console.error(e)
        /* eslint-enable no-console */
      }
    },
    checkContract (contractId) {
      this.me.partner.forEach((element) => {
        element.contracts.forEach((contrElement) => {
          if (contrElement.id === contractId) { contrElement.check = !contrElement.check }
        })
      })
      const tempSearch = this.search
      this.search = ' '
      this.search = tempSearch
    },
    checkAllContracts (partnerId, checkType) {
      this.me.partner.forEach((element) => {
        if (element.id === partnerId) {
          element.contracts.forEach((contrElement) => {
            contrElement.check = checkType
          })
        }
      })
      const tempSearch = this.search
      this.search = ' '
      this.search = tempSearch
    }
  }
}
</script>

<style>
.v-chip.Действует{
  background: #3cd1c2;
}
.v-chip.Согласование{
  background: #ffaa2c;
}
.v-chip.Закрыт{
  background: #f83e70;
}
.v-chip.Профинансирован{
  background: #3af1a2;
}
.v-card.card-dl:hover{
  background: #ffdd485e
}
</style>
