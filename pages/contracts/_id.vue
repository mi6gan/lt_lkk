<template>
  <v-container class="my-3">
    <v-toolbar flat>
      <h1 class="headline text-uppercase">
        Договор {{ contract.name }} от {{ new Date(contract.date).toLocaleDateString('ru-RU') }}
      </h1>
      <v-spacer />
    </v-toolbar>
    <v-tabs
      v-model="tabs"
      fixed-tabs
      dark
      color="transparent"
      slider-color="grey"
    >
      <v-tab href="#general-tabs" class="grey--text">
        Общие сведения
      </v-tab>
      <v-tab href="#graph-tabs" class="grey--text">
        График
      </v-tab>
      <v-tab href="#docs-tabs" class="grey--text">
        Первичные документы
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs" class="elevation-1">
      <v-tab-item
        key="1"
        value="general-tabs"
      >
        <v-card>
          <v-card-title class="text-uppercase grey--text">
            Общая информация
          </v-card-title>
          <v-card-text>
            <v-layout v-for="(value, key) in general" :key="key" class="pa-3" row wrap>
              <v-flex v-if="value" xs12>
                <div class="caption grey--text">
                  {{ key }}
                </div>
                <div>{{ value }}</div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title class="text-uppercase grey--text">
            Предметы лизинга
          </v-card-title>
          <v-card-text v-for="property in contract.properties" :key="property.name">
            <v-layout class="pa-3" row wrap>
              <v-flex class="py-1" xs12 md6>
                <div class="caption grey--text">
                  Наименование
                </div>
                <div>{{ property.name }}</div>
              </v-flex>
              <v-flex v-if="property.vin" xs12 md3>
                <div class="caption grey--text">
                  VIN
                </div>
                <div>{{ property.vin }}</div>
              </v-flex>
              <v-flex v-if="property.sign" xs12 md3>
                <div class="caption grey--text">
                  Гос. номер
                </div>
                <div>{{ property.sign }}</div>
              </v-flex>
            </v-layout>
            <v-divider />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item
        key="2"
        value="graph-tabs"
      >
        <v-card
          v-for="payment in contract.payments"
          :key="payment.date"
        >
          <v-layout class="pa-1" row wrap>
            <v-flex xs4 md6>
              <div class="caption grey--text">
                Месяц платежа
              </div>
              <div>{{ new Date(payment.date).toLocaleDateString('ru-RU') }}</div>
            </v-flex>
            <v-flex xs4 md3>
              <div class="caption grey--text">
                Сумма по плану
              </div>
              <div>{{ parseFloat(payment.plan).toLocaleString('ru-RU') }}</div>
            </v-flex>
            <v-flex xs4 md3>
              <div class="caption grey--text">
                Оплата
              </div>
              <div>{{ parseFloat(payment.paid).toLocaleString('ru-RU') }}</div>
            </v-flex>
          </v-layout>
          <v-divider />
        </v-card>
        <v-card>
          <v-layout class="pa-3" row wrap>
            <v-flex xs4 md6>
              <div>Итого:</div>
            </v-flex>
            <v-flex xs4 md3>
              <div class="caption grey--text">
                Сумма договора
              </div>
              <div>
                {{ contract.payments.reduce((acc,n) => {
                  return acc + parseFloat(n.plan)
                },0).toLocaleString('ru-RU') }}
              </div>
            </v-flex>
            <v-flex xs4 md3>
              <div class="caption grey--text">
                Поступившие оплаты
              </div>
              <div>
                {{ contract.payments.reduce((acc,n) => {
                  return acc + parseFloat(n.paid)
                },0).toLocaleString('ru-RU') }}
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </v-tab-item>
      <v-tab-item
        key="3"
        value="docs-tabs"
      >
        <v-card>
          <v-btn
            v-if="!act"
            flat
            small
            color="grey"
            target="_blank"
            @click="getAs(contract.partner_id,contract.id)"
          >
            Сформировать акт-сверки
          </v-btn>
          <v-btn
            v-if="act"
            :href="`https://cabinet.leasing-trade.ru:4000/download?id=${act}&type=as&name=LTas`"
            small
            color="primary"
            target="_blank"
          >
            Скачать акт-сверки (PDF)
          </v-btn>
        </v-card>
        <v-card
          v-for="doc in contract.archives"
          :key="doc.id"
        >
          <v-layout class="pa-3" row wrap>
            <v-flex xs4 md6>
              <div class="caption grey--text">
                Счёт-фактура
              </div>
              <div>{{ doc.name }}</div>
              <v-btn
                :href="`https://cabinet.leasing-trade.ru:4000/download?id=${doc.id}&type=sf&name=LTsf`"
                flat
                small
                color="grey"
                target="_blank"
              >
                Скачать документы (PDF)
              </v-btn>
            </v-flex>
            <v-flex xs4 md3>
              <div class="caption grey--text">
                Вид счёта-фактуры
              </div>
              <div>{{ doc.type }}</div>
            </v-flex>
            <v-flex xs4 md3>
              <div class="caption grey--text">
                Сумма
              </div>
              <div>{{ parseFloat(doc.summ).toLocaleString('ru-RU') }}</div>
            </v-flex>
          </v-layout>
          <v-divider />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return {
      tabs: null,
      act: null
    }
  },
  async asyncData ({ app, params }) {
    try {
      const client = await app.apolloProvider.defaultClient
      const res = await client.query({
        query: gql`query getContractById($id: ID!){
            contract(id: $id) {
              id
              partner_id
              name
              date
              status
              debt
              summ
              manager
              duration
              balanceholder
              payments {
                date
                plan
                paid
              }
              properties {
                name
                vin
                sign
              }
              archives {
                id
                name
                type
                summ
              }
            }
          }`,
        variables: {
          id: params.id
        }
      }).then(({ data }) => data && data.contract)
      return {
        general: {
          'Сумма договора': parseFloat(res.summ).toLocaleString('ru-RU'),
          'Статус': res.status,
          'Менеджер': res.manager,
          'Срок лизинга (мес)': res.duration,
          'Балансодержатель': res.balanceholder,
          'Текущая задолженность': res.debt
        },
        contract: res
      }
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
      /* eslint-enable no-console */
    }
  },
  methods: {
    async getAs (partnerId, contractId) {
      try {
        const res = await this.$apollo.mutate({
          mutation: gql`mutation ($partnerId:String!, $contractId:String) {
            getActSverki(partnerId: $partnerId, contractId: $contractId)
          }`,
          variables: {
            partnerId,
            contractId
          }
        }).then(({ data }) => data && data.getActSverki)
        this.act = res
      } catch (e) {
        /* eslint-disable no-console */
        console.error(e)
        /* eslint-enable no-console */
      }
    }
  }
}
</script>
