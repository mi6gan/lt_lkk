<template>
  <v-container>
    {{ selection }}
    <v-toolbar flat>
      <v-toolbar-title>Платёжный календарь за {{ year }} г.</v-toolbar-title>
      <v-spacer />
      <v-btn outlined class="mr-4" @click="year = new Date().getFullYear()">
        Сегодня
      </v-btn>
      <v-btn fab text small @click="year--">
        <v-icon small>
          arrow_back_ios
        </v-icon>
      </v-btn>
      <v-btn fab text small @click="year++">
        <v-icon small>
          arrow_forward_ios
        </v-icon>
      </v-btn>
    </v-toolbar>
    <div v-if="!selection.active">
      <v-card
        v-for="elem in payments"
        :key="elem.partner"
        class="pa-2"
      >
        <v-card-title>
          {{ elem.partner }}
        </v-card-title>
        <v-layout row wrap>
          <v-flex
            v-for="month in elem.graph"
            :key="month.date"
            xs6
            sm3
            class="pa-2 card-dl"
            @click="getGraph(elem.partnerId, month.date)"
          >
            <v-card>
              <div>{{ months[month.date] }}</div>
              <div>Сумма к оплате: {{ parseFloat(month.plan).toLocaleString('ru-RU') }} руб.</div>
            </v-card>
            <!-- <div class="caption grey--text">
                Месяц
              </div>
              <div>{{ months[month.date] }}</div>
            </v-flex>
            <v-flex xs12 sm4>
              <div class="caption grey--text">
                К оплате
              </div>
              <div>{{ parseFloat(month.plan).toLocaleString('ru-RU') }}</div>
            </v-flex>
            <v-flex xs12 sm4>
              <div class="caption grey--text">
                Оплачено
              </div>
              <div>{{ parseFloat(month.paid).toLocaleString('ru-RU') }}</div>
            </v-flex> -->
          </v-flex>
        </v-layout>
      </v-card>
    </div>
    <v-card
      v-else
    >
      <v-card-title>
        {{ selection.partner }}
      </v-card-title>
      <v-card
        v-for="contract in selection.contracts"
        :key="contract.name"
        class="pa-2 card-dl"
      >
        <v-layout row wrap>
          <v-flex xs12 sm4>
            <div class="caption grey--text">
              Договор лизинга
            </div>
            <div>{{ contract.name }}</div>
          </v-flex>
        </v-layout>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
export default {
  components: {
  },
  data: () => ({
    selection: {
      'active': false
    },
    year: new Date().getFullYear(),
    months: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь'
    ]
  }),
  computed: {
    title () {
      return new Date(this.focus).toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
    },
    payments () {
      const newArr = []
      this.me.partner.forEach((partnerEl) => {
        let newObj = {}
        partnerEl.contracts.forEach((contractEl) => {
          if (contractEl.status === 'Действует') {
            contractEl.payments.forEach((paymentEl) => {
              // const yearDate = new Date(paymentEl.date).getFullYear() new Date(paymentEl.date).toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
              if (new Date(paymentEl.date).getFullYear() === this.year) {
                const newDate = new Date(paymentEl.date).getUTCMonth()
                if (newObj[newDate]) {
                  newObj[newDate].plan += parseFloat(paymentEl.plan)
                  newObj[newDate].paid += parseFloat(paymentEl.paid)
                } else {
                  newObj[newDate] = {
                    'plan': parseFloat(paymentEl.plan),
                    'paid': parseFloat(paymentEl.paid)
                  }
                }
              }
            })
          }
        })
        const dateArr = []
        for (const key of Object.keys(newObj)) {
          dateArr.push({
            'date': key,
            'plan': newObj[key].plan,
            'paid': newObj[key].paid
          })
        }
        dateArr.sort((a, b) => {
          return new Date(a.date) - new Date(b.date)
        })
        newObj = {
          'partner': partnerEl.name,
          'partnerId': partnerEl.id,
          'graph': dateArr
        }
        newArr.push(newObj)
      })
      return newArr
    }
  },
  async asyncData ({ app }) {
    try {
      const client = await app.apolloProvider.defaultClient
      const res = await client.query({
        query: gql`query {
            me {
              partner {
                id
                name
                fullname
                contracts {
                  name
                  status
                  payments {
                    date
                    plan
                    paid
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
    getGraph (partnerId, month) {
      this.selection.active = true
      this.selection.month = this.months[month]
      this.selection.contracts = []
      this.me.partner.forEach((partnerEl) => {
        if (partnerEl.id === partnerId) {
          partnerEl.contracts.forEach((contractEl) => {
            if (contractEl.status === 'Действует') {
              const newArr = []
              contractEl.payments.forEach((paymentEl) => {
                if (new Date(paymentEl.date).getFullYear() === this.year && new Date(paymentEl.date).getUTCMonth() === parseInt(month)) {
                  newArr.push({
                    'date': paymentEl.date,
                    'plan': paymentEl.plan,
                    'paid': paymentEl.paid
                  })
                }
              })
              if (newArr.length > 0) {
                this.selection.contracts.push({
                  'name': contractEl.name,
                  'graph': newArr
                })
              }
            }
          })
          this.selection.partner = partnerEl.name
        }
      })
    }
  }
}
</script>
