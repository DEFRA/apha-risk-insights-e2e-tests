// Seeds the backend's `disease_risks` collection so the e2e API journeys run
// against real data. Documents mirror the frontend sample data and conform to
// the backend's $jsonSchema validator (snake_case fields, BSON dates).
//
// Runs on first Mongo start up (docker-entrypoint-initdb.d) before the backend
// applies its validator; the backend's later collMod keeps these documents.

db = db.getSiblingDB('apha-risk-insights-backend')

const diseaseRisks = [
  {
    _id: '5b0f7a52-3c1e-4d6a-9a47-0e8d2f1c6b01',
    disease: { code: 'AHS', name: 'African Horse Sickness' },
    risk: {
      status: 'negligible',
      previous_status: 'negligible',
      level_change: 'no change',
      source: 'Sample data',
      date_reported: new Date('2026-07-22T00:00:00Z')
    },
    risk_history: [
      {
        status: 'negligible',
        previous_status: null,
        level_change: 'undetermined',
        source: 'Sample data',
        date_reported: new Date('2026-03-18T00:00:00Z')
      }
    ]
  },
  {
    _id: '5b0f7a52-3c1e-4d6a-9a47-0e8d2f1c6b02',
    disease: { code: 'ASF', name: 'African Swine Fever' },
    risk: {
      status: 'medium',
      previous_status: 'medium',
      level_change: 'no change',
      source: 'Sample data',
      date_reported: new Date('2026-08-28T00:00:00Z')
    },
    risk_history: [
      {
        status: 'medium',
        previous_status: 'low',
        level_change: 'deteriorating',
        source: 'Sample data',
        date_reported: new Date('2026-05-20T00:00:00Z')
      },
      {
        status: 'low',
        previous_status: null,
        level_change: 'undetermined',
        source: 'Sample data',
        date_reported: new Date('2026-02-11T00:00:00Z')
      }
    ]
  },
  {
    _id: '5b0f7a52-3c1e-4d6a-9a47-0e8d2f1c6b03',
    disease: { code: 'BTV', name: 'Bluetongue' },
    strain: 'BTV-3',
    risk: {
      status: 'low',
      previous_status: 'high',
      level_change: 'improving',
      source: 'Sample data',
      date_reported: new Date('2026-09-30T00:00:00Z')
    },
    risk_history: [
      {
        status: 'high',
        previous_status: 'medium',
        level_change: 'deteriorating',
        source: 'Sample data',
        date_reported: new Date('2026-05-12T00:00:00Z')
      },
      {
        status: 'medium',
        previous_status: null,
        level_change: 'undetermined',
        source: 'Sample data',
        date_reported: new Date('2026-01-26T00:00:00Z')
      }
    ]
  },
  {
    _id: '5b0f7a52-3c1e-4d6a-9a47-0e8d2f1c6b04',
    disease: { code: 'FMD', name: 'Foot and Mouth Disease' },
    risk: {
      status: 'medium',
      previous_status: 'low',
      level_change: 'deteriorating',
      source: 'Sample data',
      date_reported: new Date('2026-09-14T00:00:00Z')
    },
    risk_history: [
      {
        status: 'low',
        previous_status: 'very low',
        level_change: 'deteriorating',
        source: 'Sample data',
        date_reported: new Date('2026-06-25T00:00:00Z')
      },
      {
        status: 'very low',
        previous_status: null,
        level_change: 'undetermined',
        source: 'Sample data',
        date_reported: new Date('2026-04-03T00:00:00Z')
      }
    ]
  },
  {
    _id: '5b0f7a52-3c1e-4d6a-9a47-0e8d2f1c6b05',
    disease: { code: 'HPAI', name: 'Highly Pathogenic Avian Influenza' },
    strain: 'H5N1',
    risk: {
      status: 'high',
      previous_status: 'medium',
      level_change: 'deteriorating',
      source: 'APHA risk assessment',
      date_reported: new Date('2026-10-01T00:00:00Z')
    },
    risk_history: [
      {
        status: 'medium',
        previous_status: 'high',
        level_change: 'improving',
        source: 'APHA risk assessment',
        date_reported: new Date('2026-06-15T00:00:00Z')
      },
      {
        status: 'high',
        previous_status: null,
        level_change: 'undetermined',
        source: 'APHA risk assessment',
        date_reported: new Date('2026-01-09T00:00:00Z')
      }
    ]
  }
]

db.disease_risks.deleteMany({})
db.disease_risks.insertMany(diseaseRisks)

print(`Seeded ${db.disease_risks.countDocuments()} disease_risks documents`)
