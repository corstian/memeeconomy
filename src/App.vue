<template>
  <div id="app">
    <Header />
    <nav class="navbar navbar-expand-md bg-primary">
      <div class="container">
        <button class="navbar-toggler navbar-toggler-right burger-menu" type="button" data-toggle="collapse" data-target="#navbar-primary" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-bar"></span>
          <span class="navbar-toggler-bar"></span>
          <span class="navbar-toggler-bar"></span>
        </button>
        <a class="navbar-brand" href="#">MemeEconomy Insights</a>
        <div class="collapse navbar-collapse" id="navbar-info">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <strong class="text-light mr-2">Order:</strong>
              <b-dropdown :text="order" class="outline-primary" right>
                <b-dropdown-item-button @click="retrieveData('NEW')">New</b-dropdown-item-button>
                <b-dropdown-item-button @click="retrieveData('HOT')">Hot</b-dropdown-item-button>
                <b-dropdown-item-button @click="retrieveData('RISING')">Rising</b-dropdown-item-button>
                <b-dropdown-item-button @click="retrieveData('POPULAR')">Popular</b-dropdown-item-button>
              </b-dropdown>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-3">
      <b-list-group>
        <b-list-group-item v-for="o in opportunities.edges" :key="o.cursor">
          <Meme :opportunity="o" />
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Meme from './components/Meme'
import Header from './components/Header'

export default {
  name: 'app',
  data () {
    return {
      opportunities: { },
      order: "RISING"
    }
  },
  components: {
    Header,
    Meme
  },
  async created () {
    await this.retrieveData();
  },
  methods: {
    async retrieveData(order) {
      if (order != undefined) this.order = order;

      var query = await this.$graph.query(
        `($order: OpportunityOrder){
          opportunities(first: 25, order: $order) {
            totalCount
            edges {
              cursor
              node {
                invested
                upvoted
                memeUri
                nuv
                recentInvestments
                recentUpvotes
                redditUri
                rnuv
                timestamp
                title
                investments {
                  amount
                  timestamp
                  upvotes
                }
              }
            }
          }
        }`, {
          order: this.order
        });
      
      this.opportunities = query.opportunities;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #dfe6e9;
}

.btn-square {
  border-radius: 0;
}
</style>
