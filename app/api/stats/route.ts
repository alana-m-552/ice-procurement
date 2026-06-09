import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const [totalResult, surveillanceResult, statesResult] = await Promise.all([

    // Total procurement action count
    supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true }),

    // All surveillance rows with confidence and obligation
    supabase
      .from('contracts')
      .select('surveillance_confidence, federal_action_obligation')
      .eq('is_surveillance', true),

    // Distinct states with surveillance contracts
    supabase
      .from('contracts')
      .select('primary_place_of_performance_state_code')
      .eq('is_surveillance', true)
      .not('primary_place_of_performance_state_code', 'is', null)
  ])

  const { data: obligatedData, error: obligatedError } = await supabase
    .rpc('sum_all_obligations')

  const totalObligatedAll = obligatedError ? null : (obligatedData ?? 0)

  // Calculate surveillance breakdown by confidence
  const breakdown = {
    high:   { count: 0, obligated: 0 },
    medium: { count: 0, obligated: 0 },
    low:    { count: 0, obligated: 0 }
  }

  let surveillanceTotalObligated = 0

  surveillanceResult.data?.forEach(r => {
    const conf = r.surveillance_confidence as 'high' | 'medium' | 'low'
    const amount = parseFloat(r.federal_action_obligation) || 0
    if (breakdown[conf]) {
      breakdown[conf].count++
      breakdown[conf].obligated += amount
    }
    surveillanceTotalObligated += amount
  })

  const uniqueStates = new Set(
    statesResult.data?.map(r => r.primary_place_of_performance_state_code)
  )

  return NextResponse.json({
    total_procurement_actions: totalResult.count,
    total_obligated_all: totalObligatedAll,
    surveillance: {
      total_count: surveillanceResult.data?.length ?? 0,
      total_obligated: surveillanceTotalObligated,
      breakdown
    },
    states_with_surveillance: uniqueStates.size
  })
}