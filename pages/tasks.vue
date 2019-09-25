<template>
  <div class="task-container">
    <ul class="task-list">
      <li class="task-column task-column-on-hold">
        <span class="task-column-header">
          <h2>Ideas/tasks</h2>
        </span>
        <div class="task-input">
          <input
            v-model="create.tasks"
            type="text"
            placeholder="Add an issue"
            @keyup.enter="addIssue('tasks')"
          >
        </div>
        <ul id="tasks" class="task-inner-list">
          <li v-for="(item,index) in tasks" :key="index" class="task-item">
            <h1>{{ item.name }}</h1>
            <ul class="assigned">
              <li v-for="(dev,index) in item.assigned" :key="index">
                <img :src="dev.avatar" alt="">
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li class="task-column task-column-in-progress">
        <span class="task-column-header">
          <h2>In Progress</h2>
        </span>
        <div class="task-input">
          <input
            v-model="create.inprogress"
            type="text"
            placeholder="Add an issue"
            @keyup.enter="addIssue('inprogress')"
          >
        </div>
        <ul id="inprogress" class="task-inner-list">
          <li v-for="(item,index) in inprogress" :key="index" class="task-item">
            <h1>{{ item.name }}</h1>
            <ul class="assigned">
              <li v-for="(dev,index) in item.assigned" :key="index">
                <img :src="dev.avatar" alt="">
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li class="task-column task-column-needs-review">
        <span class="task-column-header">
          <h2>Needs Review</h2>
        </span>
        <div class="task-input">
          <input
            v-model="create.review"
            type="text"
            placeholder="Add an issue"
            @keyup.enter="addIssue('review')"
          >
        </div>
        <ul id="review" class="task-inner-list">
          <li v-for="(item,index) in review" :key="index" class="task-item">
            <h1>{{ item.name }}</h1>
            <ul class="assigned">
              <li v-for="(dev,index) in item.assigned" :key="index">
                <img :src="dev.avatar" alt="">
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li class="task-column task-column-approved">
        <span class="task-column-header">
          <h2>Approved</h2>
        </span>
        <div class="task-input">
          <input
            v-model="create.approved"
            type="text"
            placeholder="Add an issue"
            @keyup.enter="addIssue('approved')"
          >
        </div>
        <ul id="approved" class="task-inner-list">
          <li v-for="(item,index) in approved" :key="index" class="task-item">
            <h1>{{ item.name }}</h1>
            <ul class="assigned">
              <li v-for="(dev,index) in item.assigned" :key="index">
                <img :src="dev.avatar" alt="">
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  layout: 'login',
  data () {
    return {
      create: {},
      tasks: [{
        name: 'New sidebar design',
        assigned: [{
          avatar: 'https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg'
        },
        {
          avatar: 'https://d.fastcompany.net/multisite_files/fastcompany/fc_files/profile/2219225-austin-carr-profile.jpg'
        }]
      },
      {
        name: 'Second task',
        assigned: [{
          avatar: 'https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg'
        }]
      }],
      inprogress: [{
        name: 'In progress',
        assigned: [{
          avatar: 'https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg'
        },
        {
          avatar: 'https://d.fastcompany.net/multisite_files/fastcompany/fc_files/profile/2219225-austin-carr-profile.jpg'
        }]
      }],
      review: [{
        name: 'Review',
        assigned: [{
          avatar: 'https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg'
        },
        {
          avatar: 'https://d.fastcompany.net/multisite_files/fastcompany/fc_files/profile/2219225-austin-carr-profile.jpg'
        }]
      }],
      approved: [{
        name: 'Approved',
        assigned: [{
          avatar: 'https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg'
        },
        {
          avatar: 'https://d.fastcompany.net/multisite_files/fastcompany/fc_files/profile/2219225-austin-carr-profile.jpg'
        }]
      }]
    }
  },
  methods: {
    addIssue (key) {
      if (!this.create[key]) { return }
      this[key].push({
        name: this.create[key]
      })
      this.create[key] = ''
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700');
* {
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

body {
  background: #F0F3F7;
  font-weight: 300;
  margin: 0;
  padding: 5rem;
  font-size: 1.5rem;
  font-family: 'Roboto', sans-serif;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.task-container {
  max-width: 1200px;
  margin: 20px auto;
  .task-list {
    display: flex;
    align-items: flex-start;
    @media (max-width: 750px) {
      display: block;
    }
    .task-column {
      flex: 1;
      margin: 0 10px;
      position: relative;
      overflow: hidden;
      @media (max-width: 750px) {
        margin-bottom: 30px;
      }
      .task-input {
        padding: 0 0 1rem;
        input {
          border: 1px solid #CFD9EA;
          border-top: 0;
          background: white;
          border-radius: 0.2rem;
          box-shadow: 0px 2px 5px rgba(#CFD9EA, 0.1);
          width: 100%;
          padding: 1rem;
          font-size: 1.3rem;
          font-weight: 300;
          outline: none;
          font-family: 'Roboto', sans-serif;
          transition: all .3s cubic-bezier(0.23, 1, 0.320, 1);
          &:focus {
            box-shadow: 0px 4px 10px rgba(#CFD9EA, 0.5);
          }
        }
      }
      .task-column-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem;
        h2 {
          font-size: 1.5rem;
          font-weight: 400;
          margin: 0;
          text-transform: uppercase;
        }
      }
      &-on-hold {
        .task-column-header,
        .is-moved,
        .task-options {
          background: #4B9EFD;
          color: white;
        }
      }
      &-in-progress {
        .task-column-header,
        .is-moved,
        .task-options {
          background: #FFB335;
          color: white;
        }
      }
      &-needs-review {
        .task-column-header,
        .is-moved,
        .task-options {
          background: #8473E1;
          color: white;
        }
      }
      &-approved {
        .task-column-header,
        .is-moved,
        .task-options {
          background: #44D26F;
          color: white;
        }
      }
    }
  }
}

.task-inner-list {
  min-height: 50px;
}

.task-item {
  position: relative;
  margin-bottom: 1rem;
  padding: 1rem;
  height: 120px;
  background: white;
  border-radius: 0.2rem;
  border: 1px solid #CFD9EA;
  box-shadow: 0px 2px 5px rgba(#CFD9EA, 0.1);
  transition: all .3s cubic-bezier(0.23, 1, 0.320, 1);
  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 400;
    padding-right: 2rem;
  }
  .assigned{
    display: block;
    margin-top: 1rem;
    li {
      display: inline-block;
      margin-right: 0.5rem;
      img {
        max-width: 20px;
        border-radius: 100%;
      }
    }
  }
}
</style>
