<template>
  <v-container>
    <v-toolbar flat color="grey lighten-4">
      <v-combobox
        v-model="statusChips"
        :items="Object.keys(statusColors)"
        hide-selected
        label="Отбор по статусам"
        small-chips
        clearable
        multiple
      >
        <template v-slot:selection="data">
          <v-chip
            class="white--text my-2 caption"
            :color="statusColors[data.item]"
            close
            small
            @click:close="removeChip(data.item)"
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
      <v-card
        v-for="contract in partner.contracts"
        :key="contract.id"
        :to="'/contracts/'+contract.id"
        class="card-dl"
      >
        <v-layout :class="`pa-3 contract mx-1 ${contract.status}`" row wrap>
          <v-flex xs12 sm6>
            <div class="caption grey--text">
              Договор лизинга
            </div>
            <div>{{ contract.name }} от {{ new Date(contract.date).toLocaleDateString('ru-RU') }}</div>
          </v-flex>
          <v-flex xs8 sm3>
            <div class="caption grey--text">
              Сумма договора
            </div>
            <div>{{ parseFloat(contract.summ).toLocaleString('ru-RU') }}</div>
          </v-flex>
          <v-flex xs4 sm3>
            <div class="right">
              <v-chip :color="statusColors[contract.status]" class="white--text my-2 caption" small>
                {{ contract.status }}
              </v-chip>
            </div>
          </v-flex>
          <v-flex xs12 md6>
            <div class="caption grey--text">
              Имущество
            </div>
            <div v-for="property in contract.properties" :key="property.name">
              {{ property.name }}
            </div>
          </v-flex>
          <v-flex xs8 md3>
            <div class="caption grey--text">
              VIN
            </div>
            <div v-for="property in contract.properties" :key="property.name">
              {{ property.vin }}
            </div>
          </v-flex>
          <v-flex xs4 md3>
            <div class="caption grey--text">
              гос номер
            </div>
            <div v-for="property in contract.properties" :key="property.name">
              {{ property.sign }}
            </div>
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
      search: '',
      statusChips: '',
      statusColors: {
        'Действует': '#ff8000',
        'Закрыт': '#aaafb3',
        'Профинансирован': '#00a779',
        'Согласование': '#ff7a73',
        'Готов к финансированию': '#00a779'
      }
    }
  },
  computed: {
    flr_contracts () {
      const search = this.search
      const partnerArray = this.me.partner.map((partnerel) => {
        return {
          name: partnerel.name,
          id: partnerel.id,
          contracts: partnerel.contracts.filter((entry) => {
            if (this.statusChips.length > 0 && !this.statusChips.find(elem => elem === entry.status)) {
              return false
            }
            if (entry.name.includes(search)) {
              return true
            } else {
              let tres = false
              for (let i = 0; i < entry.properties.length; i++) {
                const element = entry.properties[i]
                if (
                  element.name.toLowerCase().includes(search.toLowerCase()) ||
                  element.vin.toLowerCase().includes(search.toLowerCase()) ||
                  element.sign.toLowerCase().includes(search.toLowerCase())
                ) {
                  tres = true
                }
              }
              return tres
            }
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
.contract.Действует{
  border-left: 4px solid #ff8000;
}
.contract.Согласование{
  border-left: 4px solid #ff7a73;
}
.contract.Закрыт{
  border-left: 4px solid #aaafb3;
}
.contract.Профинансирован{
  border-left: 4px solid #00a779;
}
.v-card.card-dl:hover{
  background: #ffdd485e
}
</style>
