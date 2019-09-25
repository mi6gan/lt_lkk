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
              <v-tab href="#register-tabs" class="primary--text">
                Регистрация
              </v-tab>
            </v-tabs>
          </template>
        </v-toolbar>
        <v-tabs-items v-model="tabs" class="white elevation-1">
          <v-tab-item
            key="1"
            value="register-tabs"
          >
            <v-card class="elevation-12">
              <v-card-text>
                <v-form ref="regform" v-model="validregform" lazy-validation>
                  <v-text-field
                    v-model="password"
                    :rules="[v => !!v || 'Введите пароль']"
                    prepend-icon="assignment"
                    name="password"
                    label="Пароль"
                    type="password"
                    required
                  />
                  <v-text-field
                    v-model="passconf"
                    :rules="[v => (!!v && v) === password || 'Пароли не совпадают']"
                    prepend-icon="assignment"
                    name="passconf"
                    label="Повторите пароль"
                    type="password"
                    required
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn :disabled="!validregform" color="accent" @click="regUser">
                  Сохранить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'login',
  data () {
    return {
      tabs: null,
      password: '',
      passconf: '',
      validregform: true
    }
  },
  methods: {
    async regUser () {
      await this.$refs.regform.validate()
      if (this.validregform) {
        await this.$store.dispatch('user/regUser', { auth_token: this.$route.query.auth_token, input: { password: this.password } })
        if (this.$store.state.user.isAuth) {
          this.$router.push('/')
        } else {
          this.password = ''
          this.passconf = ''
          this.validregform = false
        }
      }
    }
  }
}
</script>
