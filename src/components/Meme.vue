<template>
  <span>
    <h5 class="mb-4">
      <a :href="opportunity.node.redditUri" target="_blank" class="font-weight-bold">{{ opportunity.node.title }}</a>
      <b-badge variant="danger" v-if="opportunity.node.rnuv == 0" class="float-right">DEAD</b-badge>
      <b-badge variant="warning" v-if="normalizedNuv > opportunity.node.rnuv && opportunity.node.rnuv != 0" class="float-right">DYING</b-badge>
    </h5>
    
    
    <div class="row">
      <div class="col-md-3">
        <a :href="opportunity.node.redditUri" target="_blank"><b-img-lazy fluid :src="opportunity.node.memeUri" /></a>
      </div>
      <div class="col-md-6">
        <!-- <div ref="chart"></div> -->
        <apexchart type="line" :options="chart" :series="series"></apexchart>
      </div>
      <div class="col-md-3">

        <span class="font-weight-bold">Total Invested:</span><br />
        {{ opportunity.node.invested }}<br />
        <hr />
        <span class="font-weight-bold">Total Upvotes:</span><br />
        {{ opportunity.node.upvoted }}<br />
        <hr />
        <span class="font-weight-bold">Net Asset Value:</span><br />
        {{ opportunity.node.nuv }}<br />
        <hr />
        <span class="font-weight-bold">Active Net Asset Value:</span>
        {{ opportunity.node.rnuv }}<br />
      </div>
    </div>
  </span>
</template>

<script>
export default {
  data () {
    return {
      chart: {},
      series: [],
      normalizedNuv: 0
    }
  },
  props: {
    opportunity: {
      type: Object,
      default() {
        return {
          node: {
            investments: []
          }
        }
      }
    }
  },
  beforeUpdate () {
    this.plotData();
  },
  created () {
    this.chart = {
      chart: {
        animations: {
          enabled: false
        },
        type: 'line'
      },
      series: [{
        name: 'updoots',
        data: []
      },
      {
        name: 'investments',
        data: []
      }],
      yaxis: [{
        title: { text: 'Updoots' }
      },
      {
        title: { text: 'Investments' },
        seriesName: 'investments',
        opposite: true
      },
      {
        seriesName: 'investments',
        opposite: true,
        show: false
      }],
      xaxis: {
        type: 'datetime'
      },
      theme: {
        palette: "palette2"
      }
    };

    this.plotData();
  },
  methods: {
    plotData() {
      let prevAmount = 0;
      let activeInvestments = [];

      this.series = [{
        name: 'updoots',
        data: this.opportunity.node.investments
          .map(e => [
            new Date(e.timestamp).getTime(),
            e.upvotes
          ])
      },
      {
        name: 'investments',
        data: this.opportunity.node.investments
          .map(e => {
            prevAmount = prevAmount + e.amount;
            
            return [
              new Date(e.timestamp).getTime(),
              prevAmount
            ];
          })
      },
      {
        name: 'active investments',
        data: this.opportunity.node.investments
          .map(e => {
            activeInvestments.push(e);

            var cutoff = new Date(e.timestamp).getTime() - (4 * 60 * 60 * 1000);

            while (new Date(activeInvestments[0].timestamp).getTime() < cutoff) {
              activeInvestments.shift();
            }

            if (activeInvestments.length > 0)
              return [new Date(e.timestamp).getTime(), activeInvestments.reduce((t, e) => t + e.amount, 0)];
            else return [new Date(e.timestamp).getTime(), 0];
          })
      }];

      // Update some stats
      var diff = (new Date() - new Date(this.opportunity.node.timestamp)) / 60000;
      
      // 240 minutes is 4 hours
      this.normalizedNuv = this.opportunity.node.nuv / diff / 240;
    }
  }
}
</script>

<style scoped>
  .card {
    margin-bottom: 1rem;
  }
</style>
