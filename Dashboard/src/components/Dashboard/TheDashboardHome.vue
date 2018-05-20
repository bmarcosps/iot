<template>
    <div class="AdminDashboardHome">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Dashboard</h1>
        </div>
        <p><i class="fas fa-thermometer-three-quarters" style="color: #F87679;"></i> Temperatura: {{temperatura}}ºc</p>
        <p><i class="fas fa-tint" style="color: #B6D6F8;"></i> Humidade: {{humidade}}%</p>
        <!--<ul>
            <li v-for="data in datas" :key="data.id">{{ data.temperatura }} - {{ data.humidade }}</li>
        </ul>-->
        <line-chart :chart-data="chartHumidade" :options="chartOptions" :width="800"></line-chart>
    </div>
</template>

<script>
import LineChart from '../commom/LineChart'
import _ from 'lodash'

Date.prototype.timeNow = function () {
  return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

export default {
  name: 'TheDashboardHome',

  components: {
    LineChart
  },

  data () {
    return {
      temperatura: 0,
      humidade: 0,
      chartOptions: {
        responsive: false,
        maintainAspectRatio: false,
        animation: {
          duration: 0, // general animation time
        },
        hover: {
          animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 0,
              suggestedMax: 100
            }
          }]
        }
      },
      chartHumidade:
        {
          labels: [],
          datasets:
            [
              {
                label: 'Temperatura',
                backgroundColor: '#f87679',
                data: []
              },
              {
                label: 'Humidade',
                backgroundColor: '#b6d6f8',
                data: []
              }
            ]
        }
    }
  }
  ,

  mqtt: {
    'dcc091Recebe1' (data) {
      let jsonData = JSON.parse(data)

      this.temperatura = jsonData.temperatura
      this.humidade = jsonData.humidade

      let temp = _.clone(this.chartHumidade)

      let currentdate = new Date();

      temp.labels.push(currentdate.timeNow())
      temp.datasets[0].data.push(this.temperatura)
      temp.datasets[1].data.push(this.humidade)

      temp.labels = _.takeRight(temp.labels, 20)
      temp.datasets[0].data = _.takeRight(temp.datasets[0].data, 20)
      temp.datasets[1].data = _.takeRight(temp.datasets[1].data, 20)

      this.chartHumidade = temp
    }
  }
  ,

  methods: {}
  ,

  mounted () {
    this.$mqtt.subscribe('dcc091Recebe1')
  }
}
</script>

<style>
</style>
