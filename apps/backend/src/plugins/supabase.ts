import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

declare module 'fastify' {
    interface FastifyInstance {
        supabase: SupabaseClient
    }
}

const supabasePlugin: FastifyPluginAsync = fp(async (server) => {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서버 사이드는 service role key 사용
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )

    server.decorate('supabase', supabase)
})

export default supabasePlugin
