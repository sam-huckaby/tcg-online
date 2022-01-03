import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: 'wzaopcdu', // you can find this in sanity.json
  dataset: 'production', // or the name you chose in step 1
  apiVersion: '2022-01-03', // Use the current UTC date to auto-select the most recent version (and prevent breaks)
  useCdn: true // `false` if you want to ensure fresh data
})