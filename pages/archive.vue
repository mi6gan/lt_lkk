<template>
  <v-container>
    <v-row class="px-5">
      <v-col cols="12" sm="6" md="4">
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
              class="white--text caption"
              :color="statusColors[data.item]"
              close
              small
              @click:close="removeChip(data.item)"
            >
              {{ data.item }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <v-chip
              class="white--text caption"
              :color="statusColors[data.item]"
              small
            >
              {{ data.item }}
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="datesRange"
              label="Период"
              prepend-icon="event"
              readonly
              v-on="on"
            />
          </template>
          <v-date-picker v-model="date.start" locale="ru-ru" @input="menu = false" />
          <v-date-picker v-model="date.end" locale="ru-ru" @input="menu = false" />
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="search"
          hide-details
          label="Поиск.."
          append-icon="search"
          clearable
        />
      </v-col>
    </v-row>
    <v-card
      v-for="partner in flr_contracts"
      :key="partner.id"
      class="ma-3"
    >
      <v-card-title class="text-uppercase grey--text">
        {{ partner.name }}
      </v-card-title>
      <v-card flat class="pa-3">
        <v-btn
          v-if="!partner.as"
          text
          small
          :loading="act_loading"
          color="accent"
          target="_blank"
          @click="getAs(partner.id)"
        >
          Сформировать акт-сверки
        </v-btn>
        <v-btn
          v-if="partner.as"
          :href="`https://cabinet.leasing-trade.ru:4000/download?id=${partner.as}&type=as&name=LTas`"
          small
          color="accent"
          target="_blank"
        >
          Скачать акт-сверки (PDF)
        </v-btn>
        <v-btn text icon color="grey" @click="checkAllContracts(partner.id, true)">
          <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
        <v-btn text icon color="grey" @click="checkAllContracts(partner.id, false)">
          <v-icon>mdi-checkbox-blank-circle-outline</v-icon>
        </v-btn>
        <v-btn
          v-if="partner.contracts.some((item) => item.check)"
          text
          small
          :loading="act_loading"
          color="accent"
          target="_blank"
        >
          Здесь будет ссылка на скачивание документов пакетом
        </v-btn>
        <v-card
          v-for="contract in partner.contracts"
          :key="contract.id"
          class="pl-5 card-dl"
          @click="checkContract(contract.id)"
        >
          <v-layout class="pa-1 contract" row wrap>
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
                <v-chip :color="statusColors[contract.status]" class="white--text my-2 caption" small>
                  {{ contract.status }}
                </v-chip>
              </div>
            </v-flex>
          </v-layout>
          <v-divider />
        </v-card>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
export default {
  data () {
    return {
      date: {
        start: '2019-01-01',
        end: new Date().toISOString().substr(0, 10)
      },
      menu: false,
      search: '',
      statusChips: '',
      statusColors: {
        'Действует': '#ff8000',
        'Закрыт': '#aaafb3',
        'Профинансирован': '#00a779',
        'Согласование': '#ff7a73',
        'Готов к финансированию': '#00a779'
      },
      act_loading: false
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
    },
    datesRange () {
      return this.date.start + '~' + this.date.end
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
      this.act_loading = true
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
      this.act_loading = false
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

</style>
