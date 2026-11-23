//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/filters/
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter
const labels = require('./lib/labels')

// Always treat a checkbox answer as a list
function asArray (value) {
  if (value === undefined || value === null || value === '') return []
  return Array.isArray(value) ? value : [value]
}

addFilter('asArray', asArray)

// {{ data.landlord | label('landlord') }} -> "The council"
addFilter('label', (value, field) => {
  const group = labels[field] || {}
  return group[value] || value
})

// {{ data.location | labelList('location') }} -> "Kitchen, Bedroom"
addFilter('labelList', (value, field) => {
  const group = labels[field] || {}
  return asArray(value).map((v) => group[v] || v).join(', ')
})

// Turn a labels group into radio or checkbox items
// {{ 'problemType' | itemsFor }}
addFilter('itemsFor', (field, exclude) => {
  const group = labels[field] || {}
  const skip = asArray(exclude)
  return Object.entries(group)
    .filter(([value]) => !skip.includes(value))
    .map(([value, text]) => ({ value, text }))
})
