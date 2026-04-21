import * as fs from 'fs'

const codes = JSON.parse(fs.readFileSync('scripts/all_codes.json', 'utf-8'))

let output = 'const codes: CodeDef[] = [\n'

for (const c of codes) {
  output += `  {\n`
  output += `    brand: ${JSON.stringify(c.brand)}, applianceType: ${JSON.stringify(c.applianceType)}, code: ${JSON.stringify(c.code)},\n`
  if (c.altCodes?.length) output += `    altCodes: ${JSON.stringify(c.altCodes)},\n`
  if (c.subtype) output += `    subtype: ${JSON.stringify(c.subtype)},\n`
  output += `    title: ${JSON.stringify(c.title)},\n`
  output += `    shortMeaning: ${JSON.stringify(c.shortMeaning)},\n`
  output += `    severityLevel: ${c.severityLevel}, canUserTrySafeChecks: ${c.canUserTrySafeChecks},\n`
  output += `    safeChecks: ${JSON.stringify(c.safeChecks)},\n`
  output += `    likelyCauses: ${JSON.stringify(c.likelyCauses)},\n`
  output += `    whenToStopAndCallService: ${JSON.stringify(c.whenToStopAndCallService)},\n`
  output += `    relatedSymptoms: ${JSON.stringify(c.relatedSymptoms)},\n`
  output += `    relatedCodes: ${JSON.stringify(c.relatedCodes)},\n`
  output += `    possibleParts: ${JSON.stringify(c.possibleParts)},\n`
  output += `    faq: ${JSON.stringify(c.faq)},\n`
  output += `    sourceType: ${JSON.stringify(c.sourceType)},\n`
  if (c.sourceUrl) output += `    sourceUrl: ${JSON.stringify(c.sourceUrl)},\n`
  if (c.images?.length) output += `    images: ${JSON.stringify(c.images)},\n`
  if (c.content?.length) output += `    content: ${JSON.stringify(c.content)},\n`
  output += `  },\n`
}

output += ']\n'
fs.writeFileSync('scripts/generated_codes.ts', output)
console.log(`Generated ${codes.length} codes`)
