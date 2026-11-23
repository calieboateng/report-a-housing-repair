// Human-readable text for every answer value.
// Used by the question pages, the check answers page and the confirmation page,
// so wording only needs changing in one place.

module.exports = {
  landlord: {
    council: 'The council',
    'housing-association': 'A housing association',
    private: 'A private landlord or letting agent',
    'not-sure': 'I’m not sure'
  },
  emergency: {
    gas: 'You can smell gas or your carbon monoxide alarm is going off',
    'no-heating': 'You have no heating or no hot water',
    'no-water': 'You have no water at all',
    electrics: 'There are exposed wires, sparks or burning smells from electrics',
    flooding: 'Water is pouring in or flooding your home',
    insecure: 'An outside door or window will not lock',
    none: 'None of these'
  },
  problemType: {
    'damp-mould': 'Damp or mould',
    leak: 'A leak or water coming in',
    heating: 'Heating or hot water',
    electrics: 'Electrics or lighting',
    'doors-windows': 'Doors, windows or locks',
    other: 'Something else'
  },
  mouldAmount: {
    small: 'Smaller than a sheet of A4 paper',
    large: 'Bigger than a sheet of A4 paper',
    'very-large': 'It covers most of a wall or ceiling'
  },
  household: {
    'under-5': 'A child aged under 5',
    'over-65': 'Someone aged 65 or over',
    pregnant: 'Someone who is pregnant',
    breathing: 'Someone with a breathing condition, such as asthma',
    immune: 'Someone with a weakened immune system',
    none: 'None of these'
  },
  location: {
    kitchen: 'Kitchen',
    bathroom: 'Bathroom or toilet',
    bedroom: 'Bedroom',
    'living-room': 'Living room',
    hallway: 'Hallway or stairs',
    outside: 'Outside or in a shared area'
  },
  howLong: {
    'less-than-week': 'Less than a week',
    '1-4-weeks': '1 to 4 weeks',
    '1-6-months': '1 to 6 months',
    'over-6-months': 'More than 6 months'
  },
  reportedBefore: {
    yes: 'Yes',
    no: 'No'
  },
  contactMethods: {
    email: 'Email',
    text: 'Text message',
    phone: 'Phone call'
  },
  access: {
    'weekday-morning': 'Weekday mornings (8am to midday)',
    'weekday-afternoon': 'Weekday afternoons (midday to 5pm)',
    saturday: 'Saturday mornings',
    any: 'Any day or time'
  },
  accessNeeds: {
    yes: 'Yes',
    no: 'No'
  }
}
