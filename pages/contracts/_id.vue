<template>
  <v-container>
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
      background-color="secondary"
      slider-color="primary"
    >
      <v-tab href="#general-tabs" class="primary--text">
        Общие сведения
      </v-tab>
      <v-tab href="#graph-tabs" class="primary--text">
        График
      </v-tab>
      <v-tab href="#docs-tabs" class="primary--text">
        Первичные документы
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs" class="elevation-1">
      <v-tab-item
        key="1"
        value="general-tabs"
      >
        <v-card class="px-3 elevation-12">
          <v-layout row wrap>
            <v-flex xs12 md6>
              <v-card-title class="text-uppercase grey--text">
                Общая информация
              </v-card-title>
              <v-card-text>
                <v-layout v-for="(value, key) in general" :key="key" class="px-3" row wrap>
                  <v-flex v-if="value" xs12>
                    <div class="caption grey--text">
                      {{ key }}
                    </div>
                    <div class="px-3">
                      {{ value }}
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-flex>
            <v-flex xs12 md6>
              <v-card-title class="text-uppercase grey--text">
                Предметы лизинга
              </v-card-title>
              <v-card-text v-for="property in contract.properties" :key="property.name">
                <v-layout class="px-3" row wrap>
                  <v-flex class="py-1" xs12 md5>
                    <div class="caption grey--text">
                      Наименование
                    </div>
                    <div>{{ property.name }}</div>
                  </v-flex>
                  <v-flex v-if="property.vin" xs12 md4>
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
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-card>
      </v-tab-item>
      <v-tab-item
        key="2"
        value="graph-tabs"
      >
        <v-card
          v-for="payment in contract.payments"
          :key="payment.date"
          class="elevation-12"
        >
          <v-layout class="px-10" row wrap>
            <v-flex xs4 md6>
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
          <v-layout class="px-10 py-3" row wrap>
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
        <v-card class="elevation-12 pa-3">
          <v-btn
            v-if="!act"
            text
            small
            :loading="act_loading"
            color="accent"
            target="_blank"
            @click="getAs(contract.partner_id,contract.id)"
          >
            Сформировать акт-сверки
          </v-btn>
          <v-btn
            v-if="act"
            :href="`https://cabinet.leasing-trade.ru:4000/download?id=${act}&type=as&name=LTas`"
            small
            color="accent"
            target="_blank"
          >
            Скачать акт-сверки (PDF)
          </v-btn>
        </v-card>
        <v-card
          v-for="doc in contract.archives"
          :key="doc.id"
          class="elevation-12 px-3"
        >
          <v-layout class="pa-3" row wrap>
            <v-flex xs4 md6>
              <div class="caption grey--text">
                Счёт-фактура
              </div>
              <div>{{ doc.name }}</div>
              <v-btn
                :href="`https://cabinet.leasing-trade.ru:4000/download?id=${doc.id}&type=sf&name=LTsf`"
                small
                text
                color="accent"
                target="_blank"
              >
                Скачать счёт-фактуру и акт (PDF)
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
      act: null,
      act_loading: false
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
          'Текущая задолженность': parseFloat(res.debt).toLocaleString('ru-RU')
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
      this.act_loading = true
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
      this.act_loading = false
    }
  }
}
</script>
