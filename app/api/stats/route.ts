import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { count, error } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: surveillanceData } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('is_surveillance', true)

  return NextResponse.json({
    total_contracts: count,
    surveillance_contracts: surveillanceData,
    message: 'Connection successful'
  })
}
