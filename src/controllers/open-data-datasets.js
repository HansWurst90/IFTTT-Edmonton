const { returnData, getDatasets } = require('../utils/store-odp-data')

function truncateString(string, maxLength) {
  let longer = string.length > maxLength ? true : false
  if (longer) {
    return string.slice(0, maxLength).trimEnd() + '...'
  } else {
    return string
  }
}

/**
 * Gets the datasets from the cache and returns as a response
 */
module.exports = async function(req, res) {
  let cache = req.cache
  let datasets
  let data
  let newData
  let timer
  try {
    // console.log("Getting latest datasets")
    // datasets = JSON.parse(await cache.getLatest('datasets'))
    // if (!datasets) {
    //   console.log("No datasets found")
    //   datasets = (await getDatasets()).sort
    //   cache.add('datasets', JSON.stringify(datasets))
    // }
    // console.log("Starting to get columns")
    // let timer = Date.now()
    // data = await returnData(datasets)
    // console.log(`Time took: ${Date.now() - timer} ms`)
    console.log('Getting dataset options...')
    timer = Date.now()
    data = await req.store.getDatasetData()
    newData = data.map(dataset => {
      let newLabel = truncateString(dataset.label, 65)
      let newValues = dataset.values.map(value => {
        let newValue = truncateString(value.label, 65)
        return { label: newValue, value: value.value }
      })
      return { label: newLabel, values: newValues }
    })
  } catch (e) {
    e.code = 500
    throw e
  }
  res.status(200).send({
    data: newData
  })
  console.log(`Options sent. Time: ${Date.now() - timer} ms`)
}
