// scripts/geocode.ts
// Run with: npx ts-node scripts/geocode.ts

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

// Free US ZIP code coordinate lookup (no API key needed)
// Uses the public Zippopotam.us API
async function getCoordinates(zip: string): Promise<{lat: number, lng: number} | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip.slice(0, 5)}`)
    if (!res.ok) return null
    const data = await res.json()
    return {
      lat: parseFloat(data.places[0]['latitude']),
      lng: parseFloat(data.places[0]['longitude'])
    }
  } catch { return null }
}

async function main() {
  // Get all surveillance contracts missing coordinates
  const { data: contracts } = await supabase
    .from('contracts')
    .select('award_id_piid, primary_place_of_performance_zip_4')
    .eq('is_surveillance', true)
    .is('latitude', null)
    .not('primary_place_of_performance_zip_4', 'is', null)

  if (!contracts) return
  console.log(`Geocoding ${contracts.length} surveillance contracts...`)

  for (const contract of contracts) {
    const zip = contract.primary_place_of_performance_zip_4
    const coords = await getCoordinates(zip)
    if (!coords) continue

    await supabase
      .from('contracts')
      .update({ latitude: coords.lat, longitude: coords.lng })
      .eq('award_id_piid', contract.award_id_piid)

    // Be polite to the free API — wait 100ms between requests
    await new Promise(r => setTimeout(r, 100))
    process.stdout.write('.')
  }
  console.log('\nDone!')
}

main()
