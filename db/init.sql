DO $$ 
BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'eneasredpill') THEN
      EXECUTE 'CREATE SCHEMA eneasredpill';
   END IF;
END $$;
