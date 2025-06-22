-- Create master_databases table for storing compressed data from master databases
CREATE TABLE IF NOT EXISTS public.master_databases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    master_id TEXT NOT NULL UNIQUE,
    campaign_name TEXT NOT NULL,
    google_account TEXT NOT NULL,
    api_key_primary TEXT NOT NULL,
    database_url TEXT NOT NULL,
    database_type TEXT NOT NULL CHECK (database_type IN ('supabase', 'postgresql', 'mysql', 'mongodb')),
    connection_status TEXT NOT NULL DEFAULT 'disconnected' CHECK (connection_status IN ('connected', 'disconnected', 'error')),
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    compressed_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_master_databases_master_id ON public.master_databases(master_id);
CREATE INDEX IF NOT EXISTS idx_master_databases_campaign_name ON public.master_databases(campaign_name);
CREATE INDEX IF NOT EXISTS idx_master_databases_google_account ON public.master_databases(google_account);
CREATE INDEX IF NOT EXISTS idx_master_databases_connection_status ON public.master_databases(connection_status);
CREATE INDEX IF NOT EXISTS idx_master_databases_last_sync ON public.master_databases(last_sync);

-- Enable RLS
ALTER TABLE public.master_databases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Developers can view all master databases" ON public.master_databases
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('developer', 'admin')
        )
    );

CREATE POLICY "Developers can insert master databases" ON public.master_databases
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('developer', 'admin')
        )
    );

CREATE POLICY "Developers can update master databases" ON public.master_databases
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('developer', 'admin')
        )
    );

CREATE POLICY "Developers can delete master databases" ON public.master_databases
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('developer', 'admin')
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_master_databases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_master_databases_updated_at
    BEFORE UPDATE ON public.master_databases
    FOR EACH ROW
    EXECUTE FUNCTION update_master_databases_updated_at();

-- Insert some sample data for testing
INSERT INTO public.master_databases (master_id, campaign_name, google_account, api_key_primary, database_url, database_type, connection_status, compressed_data) VALUES
('master_001', 'Campaña Norte 2025', 'norte.campaign@gmail.com', 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'https://norte-campaign.supabase.co', 'supabase', 'connected', '{"total_voters": 15420, "active_territories": 45, "last_update": "2025-06-21T23:28:00Z"}'),
('master_002', 'Campaña Sur Electoral', 'sur.electoral@gmail.com', 'AIzaSyCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'https://sur-campaign.supabase.co', 'supabase', 'connected', '{"total_voters": 12350, "active_territories": 38, "last_update": "2025-06-21T23:28:00Z"}'),
('master_003', 'Campaña Este Democrática', 'este.democratica@gmail.com', 'AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'https://este-campaign.supabase.co', 'supabase', 'disconnected', '{"total_voters": 9870, "active_territories": 32, "last_update": "2025-06-21T22:15:00Z"}'),
('master_004', 'Campaña Oeste Popular', 'oeste.popular@gmail.com', 'AIzaSyExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'https://oeste-campaign.supabase.co', 'supabase', 'error', '{"total_voters": 11200, "active_territories": 41, "last_update": "2025-06-21T21:45:00Z"}')
ON CONFLICT (master_id) DO NOTHING; 