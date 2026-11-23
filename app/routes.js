//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/create-routes/
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const asArray = (value) => {
  if (value === undefined || value === null || value === '') return []
  return Array.isArray(value) ? value : [value]
}

const isBlank = (value) => value === undefined || value === null || String(value).trim() === ''

// UK postcode check, loose enough for a prototype
const postcodePattern = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[0-9+()\s-]{10,16}$/

const DESCRIPTION_LIMIT = 500

// ---------------------------------------------------------------------------
// The journey
//
// Each question page has:
//   validate(data) -> object of { fieldId: 'Error message' }, empty if fine
//   next(data)     -> where to go after a valid answer
//
// Error messages follow the GOV.UK Design System guidance:
// https://design-system.service.gov.uk/components/error-message/
// ---------------------------------------------------------------------------

const journey = {
  landlord: {
    validate: (d) => isBlank(d.landlord) ? { landlord: 'Select who your landlord is' } : {},
    next: (d) => {
      if (d.landlord === 'private') return '/private-landlord'
      if (d.landlord === 'not-sure') return '/landlord-not-sure'
      return '/emergency'
    }
  },

  emergency: {
    validate: (d) => asArray(d.emergency).length === 0
      ? { emergency: 'Select if the problem is one of these, or select ‘None of these’' }
      : {},
    next: (d) => {
      const answers = asArray(d.emergency)
      d.isEmergency = answers.some((a) => a !== 'none')
      if (answers.includes('gas')) return '/emergency-gas'
      if (d.isEmergency) return '/emergency-repair'
      return '/problem-type'
    }
  },

  'problem-type': {
    validate: (d) => isBlank(d.problemType) ? { problemType: 'Select what the problem is' } : {},
    next: (d) => {
      if (d.problemType === 'damp-mould') return '/mould-amount'
      // Clear damp and mould answers if the user changes their mind
      delete d.mouldAmount
      delete d.household
      return '/location'
    }
  },

  'mould-amount': {
    validate: (d) => isBlank(d.mouldAmount) ? { mouldAmount: 'Select how much damp or mould there is' } : {},
    next: () => '/household'
  },

  household: {
    validate: (d) => asArray(d.household).length === 0
      ? { household: 'Select if anyone in your home fits these descriptions, or select ‘None of these’' }
      : {},
    next: () => '/location'
  },

  location: {
    validate: (d) => asArray(d.location).length === 0
      ? { location: 'Select where in your home the problem is' }
      : {},
    next: () => '/description'
  },

  description: {
    validate: (d) => {
      if (isBlank(d.description)) return { description: 'Describe the problem' }
      if (d.description.length > DESCRIPTION_LIMIT) {
        return { description: `Description must be ${DESCRIPTION_LIMIT} characters or fewer` }
      }
      return {}
    },
    next: () => '/how-long'
  },

  'how-long': {
    validate: (d) => isBlank(d.howLong) ? { howLong: 'Select how long this has been a problem' } : {},
    next: () => '/reported-before'
  },

  'reported-before': {
    validate: (d) => isBlank(d.reportedBefore)
      ? { reportedBefore: 'Select yes if you have reported this problem before' }
      : {},
    next: (d) => {
      if (d.reportedBefore === 'no') delete d.previousReference
      return '/photos'
    }
  },

  photos: {
    // Optional question
    validate: () => ({}),
    next: () => '/postcode'
  },

  postcode: {
    validate: (d) => {
      if (isBlank(d.postcode)) return { postcode: 'Enter your postcode' }
      if (!postcodePattern.test(d.postcode.trim())) return { postcode: 'Enter a real postcode, like L1 8JQ' }
      return {}
    },
    next: (d) => {
      d.postcode = d.postcode.trim().toUpperCase()
      return '/select-address'
    }
  },

  'select-address': {
    validate: (d) => isBlank(d.address) ? { address: 'Select your address' } : {},
    next: (d) => {
      if (d.address === 'not-listed') return '/manual-address'
      return '/name'
    }
  },

  'manual-address': {
    validate: (d) => {
      const errors = {}
      if (isBlank(d.addressLine1)) errors.addressLine1 = 'Enter the first line of your address'
      if (isBlank(d.addressTown)) errors.addressTown = 'Enter your town or city'
      return errors
    },
    next: () => '/name'
  },

  name: {
    validate: (d) => isBlank(d.fullName) ? { fullName: 'Enter your full name' } : {},
    next: () => '/contact'
  },

  contact: {
    validate: (d) => {
      const methods = asArray(d.contactMethods)
      if (methods.length === 0) return { contactMethods: 'Select how your landlord should contact you' }
      const errors = {}
      if (methods.includes('email')) {
        if (isBlank(d.email)) errors.email = 'Enter your email address'
        else if (!emailPattern.test(d.email.trim())) errors.email = 'Enter an email address in the correct format, like name@example.com'
      }
      if (methods.includes('text')) {
        if (isBlank(d.mobile)) errors.mobile = 'Enter your mobile phone number'
        else if (!phonePattern.test(d.mobile.trim())) errors.mobile = 'Enter a mobile phone number, like 07700 900 982'
      }
      if (methods.includes('phone')) {
        if (isBlank(d.phone)) errors.phone = 'Enter your phone number'
        else if (!phonePattern.test(d.phone.trim())) errors.phone = 'Enter a phone number, like 01632 960 001 or 07700 900 982'
      }
      return errors
    },
    next: (d) => {
      const methods = asArray(d.contactMethods)
      if (!methods.includes('email')) delete d.email
      if (!methods.includes('text')) delete d.mobile
      if (!methods.includes('phone')) delete d.phone
      return '/access'
    }
  },

  access: {
    validate: (d) => asArray(d.access).length === 0
      ? { access: 'Select when someone can visit your home' }
      : {},
    next: () => '/access-needs'
  },

  'access-needs': {
    validate: (d) => {
      if (isBlank(d.accessNeeds)) {
        return { accessNeeds: 'Select yes if there is anything the repair team should know' }
      }
      if (d.accessNeeds === 'yes' && isBlank(d.accessDetails)) {
        return { accessDetails: 'Tell us what the repair team should know' }
      }
      return {}
    },
    next: (d) => {
      if (d.accessNeeds === 'no') delete d.accessDetails
      return '/check-answers'
    }
  }
}

// Extra values some pages need when they are shown, including after an error
const pageLocals = {
  'select-address': (data) => {
    const postcode = data.postcode || 'L1 8JQ'
    const streets = ['Flat 1, 12 Mersey View', 'Flat 2, 12 Mersey View', 'Flat 3, 12 Mersey View', '14 Mersey View', '16 Mersey View']
    return { addresses: streets.map((street) => `${street}, Liverpool, ${postcode}`) }
  }
}

// If the user came from "Change" on the check answers page,
// send them back there once the answer is valid,
// unless their new answer opens up questions they have not seen yet.
const returnsToCheck = (page, data, next) => {
  if (data.returnTo !== 'check') return next
  const opensNewQuestions = {
    'problem-type': () => data.problemType === 'damp-mould' && asArray(data.household).length === 0,
    'select-address': () => data.address === 'not-listed' && isBlank(data.addressLine1),
    postcode: () => true,
    emergency: () => next !== '/problem-type'
  }
  if (opensNewQuestions[page] && opensNewQuestions[page]()) return next
  return '/check-answers'
}

// Build one POST handler per question page
Object.entries(journey).forEach(([page, step]) => {
  router.post('/' + page, (req, res) => {
    const data = req.session.data
    const errors = step.validate(data)
    const fields = Object.keys(errors)

    if (fields.length > 0) {
      const errorList = fields.map((field) => ({ text: errors[field], href: '#' + field }))
      const extra = pageLocals[page] ? pageLocals[page](data) : {}
      return res.render(page, { ...extra, errors, errorList })
    }

    const next = step.next(data)
    res.redirect(returnsToCheck(page, data, next))
  })
})

// Remember when the user is changing an answer from the check answers page
router.use((req, res, next) => {
  if (req.method === 'GET' && req.query.change === 'true') req.session.data.returnTo = 'check'
  next()
})

router.get('/check-answers', (req, res, next) => {
  req.session.data.returnTo = 'check'
  next()
})

// Fake address lookup for the postcode the user entered
router.get('/select-address', (req, res) => {
  res.render('select-address', pageLocals['select-address'](req.session.data))
})

router.get('/manual-address', (req, res) => {
  const data = req.session.data
  if (isBlank(data.addressPostcode)) data.addressPostcode = data.postcode
  res.render('manual-address', { data })
})

// Submit the report
router.post('/check-answers', (req, res) => {
  const data = req.session.data
  const number = Math.floor(100000 + Math.random() * 900000)
  data.reference = `HR-${number}`
  delete data.returnTo
  res.redirect('/confirmation')
})

// Start again with empty answers
router.get('/start-again', (req, res) => {
  req.session.data = {}
  res.redirect('/')
})
