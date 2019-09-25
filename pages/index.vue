<template>
  <v-container>
    <v-layout class="pa-3" row wrap>
      <v-flex ma-1 xs12 md4>
        <v-card class="mx-auto">
          <v-card-title class="text-uppercase grey--text">
            Сообщения компании
          </v-card-title>
          <v-img
            class="white--text"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title class="align-end fill-height">
              Баннер или реклама
            </v-card-title>
          </v-img>
          <v-list three-line>
            <template v-for="(message, index) in messages">
              <v-subheader
                v-if="message.header"
                :key="message.header"
                v-text="message.header"
              />
              <v-divider
                v-else-if="message.divider"
                :key="index"
                :inset="message.inset"
              />
              <v-list-item
                v-else
                :key="message.title"
              >
                <v-list-item-avatar>
                  <v-img :src="message.avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="message.title" />
                  <v-list-item-subtitle v-html="message.subtitle" />
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex ma-1 xs12 md4>
        <v-card class="mx-auto">
          <v-card-title class="text-uppercase grey--text">
            Контакты
          </v-card-title>
          <v-list three-line>
            <template v-for="(contact, index) in contacts">
              <v-divider
                v-if="contact.divider"
                :key="index"
                :inset="contact.inset"
              />
              <v-list-item
                v-else
                :key="contact.title"
              >
                <v-list-item-avatar>
                  <v-img :src="contact.avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="contact.name" />
                  <v-list-item-subtitle v-html="contact.email" />
                  <v-list-item-subtitle v-html="contact.phone" />
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      messages: [
        { header: 'Today' },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
        },
        { divider: true, inset: false },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
          title: 'Birthday gift',
          subtitle: "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          title: 'Recipe to try',
          subtitle: "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
        }
      ],
      contacts: [
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          name: 'Бухгалтерия',
          email: 'info@leasing-trade.ru',
          phone: '8 800 505 73 94'
        },
        { divider: true, inset: false },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
          name: 'Сопровождение',
          email: 'name@leasing-trade.ru',
          phone: '8 800 505 73 94'
        },
        { divider: true, inset: false },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          name: 'Георгий Крахотин',
          email: 'g.krahotin@leasing-trade.ru',
          phone: '8 917 000 00 00'
        },
        { divider: true, inset: false },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          name: 'Техподдержка',
          email: 'help@leasing-trade.ru',
          phone: '8 800 505 73 94'
        }
      ]
    }
  }
}
</script>
