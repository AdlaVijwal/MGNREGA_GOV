import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { DATA_GOV_API_CONFIG, type DataGovResponse } from './config.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface MgnregaDataPayload {
  district_id: string;
  month: number;
  year: number;
  households_worked: number;
  person_days: number;
  women_participation: number;
  total_expenditure: number;
  avg_wage_rate: number;
  budget_allocated: number;
}

async function fetchDataGovData(apiKey: string, offset = 0): Promise<DataGovResponse> {
  const params = new URLSearchParams({
    api_key: apiKey,
    format: DATA_GOV_API_CONFIG.FORMAT,
    offset: offset.toString(),
    limit: DATA_GOV_API_CONFIG.LIMIT.toString(),
  });

  const response = await fetch(
    `${DATA_GOV_API_CONFIG.BASE_URL}/${DATA_GOV_API_CONFIG.MGNREGA_RESOURCE_ID}?${params}`,
    {
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Data.gov.in API error: ${response.statusText}`);
  }

  return response.json();
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'POST') {
      const { apiKey } = await req.json();
      
      if (!apiKey) {
        throw new Error('Data.gov.in API key is required');
      }

      let offset = 0;
      let totalRecords = 0;
      const batchSize = DATA_GOV_API_CONFIG.LIMIT;

      // First get the district mapping
      const { data: districts } = await supabase
        .from('districts')
        .select('id, name')
        .order('name');

      const districtMap = new Map(districts?.map(d => [d.name.toLowerCase(), d.id]));

      do {
        const response = await fetchDataGovData(apiKey, offset);
        totalRecords = response.total;

        const records = response.records.map(record => ({
          district_id: districtMap.get(record.district_name.toLowerCase()),
          month: record.month,
          year: record.year,
          households_worked: record.households_worked,
          person_days: record.persondays_generated,
          women_participation: (record.women_persondays / record.persondays_generated) * 100,
          total_expenditure: record.total_expenditure,
          avg_wage_rate: record.wage_rate,
          budget_allocated: record.budget_allocation,
          updated_at: new Date().toISOString(),
        })).filter(record => record.district_id); // Only include records where we found a matching district

        if (records.length > 0) {
          const { error } = await supabase
            .from('mgnrega_data')
            .upsert(records, { onConflict: 'district_id,year,month' });

          if (error) throw error;
        }

        offset += batchSize;
      } while (offset < totalRecords);

      if (error) {
        throw error;
      }

      await supabase
        .from('cache_status')
        .update({
          last_updated: new Date().toISOString(),
          source_status: 'active',
        })
        .eq('id', (await supabase.from('cache_status').select('id').single()).data?.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Data synced successfully',
          data,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (req.method === 'GET') {
      const { data: cacheStatus } = await supabase
        .from('cache_status')
        .select('*')
        .single();

      const { count } = await supabase
        .from('mgnrega_data')
        .select('*', { count: 'exact', head: true });

      return new Response(
        JSON.stringify({
          last_updated: cacheStatus?.last_updated,
          total_records: count,
          status: cacheStatus?.source_status,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An error occurred',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
