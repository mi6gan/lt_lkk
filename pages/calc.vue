<template>
  <v-container>
    <v-toolbar flat>
      <h1 class="headline text-uppercase">
        Калькулятор лизинга
      </h1>
      <v-spacer />
    </v-toolbar>
    <v-card>
      <v-layout class="pa-3" row wrap>
        <v-flex xs4 md4>
          <v-text-field
            v-model="calcInput.price"
            prepend-icon="mdi-currency-rub"
            name="price"
            label="Стоимость"
          />
        </v-flex>
        <v-flex xs4 md4>
          <v-text-field
            v-model="calcInput.prepaid"
            prepend-icon="mdi-currency-rub"
            name="prepaid"
            label="Первоначальный аванс"
          />
        </v-flex>
        <v-flex xs4 md4>
          <v-text-field
            v-model="calcInput.duration"
            prepend-icon="mdi-calendar-clock"
            name="duration"
            label="Срок лизинга"
          />
        </v-flex>
      </v-layout>
    </v-card>
    <v-card
      v-for="payment in calc"
      :key="payment.date"
    >
      <v-layout class="pa-1" row wrap>
        <v-flex xs4 md6>
          <div class="caption grey--text">
            Месяц платежа
          </div>
          <div>{{ payment.date == 0 ? 'Аванс' : payment.date == 99 ? 'Выкупной платёж' : payment.date }}</div>
        </v-flex>
        <v-flex xs8 md6>
          <div class="caption grey--text">
            Сумма платежа
          </div>
          <div>{{ parseFloat(payment.plan).toLocaleString('ru-RU') }}</div>
        </v-flex>
      </v-layout>
      <v-divider />
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
      calc: [],
      calcInput: {
        duration: '30',
        graph_type: 'annuity',
        price: '5000000',
        prepaid: '1111000'
      }
    }
  },
  watch: {
    calcInput: {
      handler (val) {
        this.getCalc()
      },
      deep: true
    }
  },
  methods: {
    async getCalc () {
      // const calcInput = this.calcInput
      try {
        const res = await this.$apollo.query({
          query: gql`query ($calcInput: CalcInput!) {
            calc(input: $calcInput) {
              date
              plan
            }
          }`,
          variables: {
            calcInput: this.calcInput
          }
        }).then(({ data }) => data && data.calc)
        this.calc = res
      } catch (e) {
        /* eslint-disable no-console */
        console.error(e)
        /* eslint-enable no-console */
      }
    }
  }
}
</script>
