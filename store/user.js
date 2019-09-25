import gql from 'graphql-tag'

export const state = () => ({
  isAuth: false,
  user: {
    email: '',
    partner: {
      inn: '',
      name: '',
      id: ''
    }
  },
  curr_partner: ''
})

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  clearUser (state) {
    state.isAuth = false
    state.user = {
      email: '',
      partner: {
        inn: '',
        name: ''
      }
    }
    state.curr_partner = ''
  },
  setAuth (state, payload) {
    state.isAuth = payload
  },
  setPartner (state, payload) {
    state.curr_partner = payload
  }
}

export const actions = {
  async getUserData ({ commit }) {
    const client = await this.app.apolloProvider.defaultClient
    const res = await client.query({
      query: gql`query {
        me {
          email
          partner {
            name
            inn
            id
          }
        }
      }`
    }).then(({ data }) => data && data.me)
    await commit('setUser', res)
    await commit('setPartner', res.partner[0])
  },
  async loginUser ({ commit }, payload) {
    const client = await this.app.apolloProvider.defaultClient
    try {
      const res = await client.mutate({
        mutation: gql`mutation ($email: String!, $password: String!) {
          loginUser(email: $email, password: $password)
        }`,
        variables: {
          email: payload.email,
          password: payload.password
        }
      }).then(({ data }) => data && data.loginUser)
      await this.$apolloHelpers.onLogin(res)
      await commit('setAuth', true)
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
      /* eslint-enable no-console */
    }
  },
  async regUser ({ dispatch }, payload) {
    const client = await this.app.apolloProvider.defaultClient
    try {
      const resauth = await client.query({
        query: gql`query ($token: String!) {
          user(authToken: $token) {
            _id
          }
        }`,
        variables: {
          token: payload.auth_token
        }
      }).then(({ data }) => data && data.user)
      const res = await client.mutate({
        mutation: gql`mutation ($id: String!, $input: UserInput!) {
          editUser(id: $id, input: $input) {
            email
          }
        }`,
        variables: {
          id: resauth._id,
          input: payload.input
        }
      }).then(({ data }) => data && data.editUser)
      await dispatch('loginUser', { email: res.email, password: payload.input.password })
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
      /* eslint-enable no-console */
    }
  }
}
