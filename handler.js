'user strict'

const { CanvasRenderService } = require('chartjs-node-canvas')
const fs = require('fs')
const { promisify } = require('util')
const cubejs = require('@cubejs-client/core')

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const cubejsApi = cubejs(process.env.CUBEJS_TOKEN)

// bug workaround: https://github.com/vmpowerio/chartjs-node/issues/26
if (global.CanvasGradient === undefined) {
  global.CanvasGradient = function () {}
}

async function renderChartWithChartJS () {
  const resultSet = await cubejsApi.load({
    measures: ['Container.count'],
    dimensions: ['Container.type']
  })
  console.log(resultSet)

  const width = 400
  const height = 400

  const chartCallback = (ChartJS) => {
    ChartJS.defaults.global.responsive = true
    ChartJS.defaults.global.maintainAspectRatio = false
  }

  console.log('Rendering chart')
  const canvasRenderService = new CanvasRenderService(width, height, chartCallback)
  return canvasRenderService.renderToBuffer(resultSet)
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

module.exports.hello = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello' })
  }

  return response
}
