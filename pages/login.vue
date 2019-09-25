<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm10 md8>
        <v-toolbar dark color="secondary">
          <v-toolbar-title>Личный кабинет ООО "Лизинг-Трейд"</v-toolbar-title>
          <template v-slot:extension>
            <v-tabs
              v-model="tabs"
              fixed-tabs
              color="transparent"
              background-color="secondary"
              dark
              slider-color="primary"
            >
              <v-tab href="#login-tabs" class="primary--text">
                Вход
              </v-tab>
              <v-tab href="#register-tabs" class="primary--text">
                Регистрация
              </v-tab>
              <!-- <v-tab href="#lost-password-tabs" class="primary--text">
                Забыл пароль
              </v-tab> -->
            </v-tabs>
          </template>
        </v-toolbar>
        <v-tabs-items v-model="tabs" class="white elevation-1">
          <v-tab-item
            key="1"
            value="login-tabs"
          >
            <v-card class="elevation-12">
              <v-card-text>
                <v-form ref="loginform" v-model="validloginform" lazy-validation>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    prepend-icon="alternate_email"
                    name="email"
                    label="E-mail"
                    required
                  />
                  <v-text-field
                    id="password"
                    v-model="password"
                    :rules="[v => !!v || 'Введите пароль']"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    required
                    @keyup.enter="loginUser"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn :disabled="!validloginform" color="accent" @click="loginUser">
                  Войти
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <v-tab-item
            key="2"
            value="register-tabs"
          >
            <v-card class="elevation-12">
              <v-card-text>
                <v-form ref="regform" v-model="validregform" lazy-validation>
                  <v-text-field
                    v-if="!partner.name"
                    v-model="inn"
                    :counter="10"
                    :rules="innRules"
                    prepend-icon="assignment"
                    name="inn"
                    label="ИНН"
                    type="text"
                    required
                  />
                  <span v-else>Здравствуйте, {{ partner.name }}</span>
                  <v-text-field
                    v-if="partner.name && !partner.isemail"
                    v-model="email"
                    :rules="emailRules"
                    prepend-icon="alternate_email"
                    name="email"
                    label="Мы не нашли Ваш E-mail, просьба ввести"
                    required
                  />
                  <p v-else-if="partner.isemail">
                    Мы нашли Ваш E-mail в нашей базе, Вам будет отправлена ссылка на регистрацию.
                  </p>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn v-if="!emailsend" :disabled="!validregform" color="accent" @click="findUser">
                  {{ partner.name ? 'Отправить' : 'Найти' }}
                </v-btn>
                <v-btn v-if="emailsend" disabled>
                  Письмо отправлено
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <!-- <v-tab-item
            key="3"
            value="lost-password-tabs"
          >
            <v-card class="elevation-12">
              <v-card-text>
                <v-form>
                  <v-text-field v-model="email" prepend-icon="alternate_email" name="email" label="E-mail" type="text" />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="loginUser" color="secondary">
                  Отправить ссылку на восстановление пароля
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item> -->
        </v-tabs-items>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'

export default {
  layout: 'login',
  data () {
    return {
      tabs: null,
      email: '',
      emailRules: [
        v => !!v || 'Необходимо заполнить e-mail',
        v => /.+@.+/.test(v) || 'E-mail должен быть реальным'
      ],
      password: '',
      inn: '',
      innRules: [
        v => !!v || 'Введите ИНН',
        v => /^([0-9]{10}|[0-9]{12})$/.test(v) || 'ИНН должен состоять только из цифр'
      ],
      validloginform: true,
      validregform: true,
      partner: {},
      emailsend: false
    }
  },
  methods: {
    async loginUser () {
      await this.$refs.loginform.validate()
      if (this.validloginform) {
        await this.$store.dispatch('user/loginUser', { email: this.email, password: this.password })
        if (this.$store.state.user.isAuth) {
          this.$router.push('/')
        } else {
          this.password = ''
          this.validloginform = false
        }
      }
    },
    async findUser () {
      await this.$refs.regform.validate()
      if (this.validregform) {
        const inn = this.inn
        const email = this.email
        try {
          if (this.partner.name) {
            const res = await this.$apollo.mutate({
              mutation: gql`mutation ($inn: String!, $email:String) {
                regPartner(inn: $inn, email: $email)
              }`,
              variables: {
                inn,
                email
              }
            }).then(({ data }) => data && data.regPartner)
            this.emailsend = res
          } else {
            const res = await this.$apollo.query({
              query: gql`query ($inn: String!) {
                findpartner(inn: $inn) {
                  name
                  isemail
                }
              }`,
              variables: {
                inn
              }
            }).then(({ data }) => data && data.findpartner)
            this.partner = res
          }
        } catch (e) {
          /* eslint-disable no-console */
          console.error(e)
          /* eslint-enable no-console */
        }
      }
    }
  }
}
</script>
