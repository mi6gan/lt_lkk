export const state = () => ({
  navlinks: [
    {
      icon: 'mdi-apps',
      title: 'Главная',
      to: '/'
    },
    {
      icon: 'mdi-train-car',
      title: 'Лизинговые проекты',
      to: '/projects'
    },
    {
      icon: 'mdi-train-car',
      title: 'Договоры лизинга',
      to: '/contracts'
    },
    {
      icon: 'mdi-file-document-box-search-outline',
      title: 'Документация',
      to: '/archive'
    },
    {
      icon: 'mdi-calendar-month-outline',
      title: 'График платежей',
      to: '/calendar'
    },
    {
      icon: 'mdi-calculator-variant',
      title: 'Калькулятор лизинга',
      to: '/calc'
    },
    {
      icon: 'mdi-mail',
      title: 'FAQ',
      to: '/faq'
    },
    {
      icon: 'mdi-exit-run',
      title: 'Данные организации',
      to: '/info'
    }
  ],
  drawer: true,
  color: 'primary'
})

export const mutations = {
  setDrawer (state, payload) {
    state.drawer = payload
  },
  setColor (state, payload) {
    state.color = payload
  },
  toggleDrawer (state) {
    state.drawer = !state.drawer
  }
}
