'user strict'

const { CanvasRenderService } = require('chartjs-node-canvas')
const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

// bug workaround: https://github.com/vmpowerio/chartjs-node/issues/26
if (global.CanvasGradient === undefined) {
  global.CanvasGradient = function () {}
}

async function renderChartWithChartJS () {
  const width = 400
  const height = 400
  const configuration = {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: (value) => '$' + value
          }
        }]
      }
    }
  }
  const chartCallback = (ChartJS) => {
    ChartJS.defaults.global.responsive = true
    ChartJS.defaults.global.maintainAspectRatio = false
  }

  console.log('Rendering chart')
  const canvasRenderService = new CanvasRenderService(width, height, chartCallback)
  return canvasRenderService.renderToBuffer(configuration)
}

module.exports.generate = async (event) => {
  const buffer = await renderChartWithChartJS()
  await writeFileAsync('/tmp/chartjs-lambda.png', buffer)
  const image = await readFileAsync('/tmp/chartjs-lambda.png')
  console.log('image: ', image)

  const response = {
    statusCode: 200,
    body: null
  }

  return response
}
