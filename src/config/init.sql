CREATE SCHEMA pergamo;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE pergamo.document(
	id VARCHAR(40) NOT NULL DEFAULT uuid_generate_v4()::varchar,
	creation_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	modification_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	path VARCHAR(250) NOT NULL,
	metadata JSONB NOT NULL,
	CONSTRAINT docuemnt_pk PRIMARY KEY(ID)
);

CREATE OR REPLACE FUNCTION pergamo.new_document()
RETURNS TRIGGER AS $$
DECLARE
  id_path VARCHAR(64);
BEGIN
	id_path := encode(sha256((NEW.id)::bytea), 'hex');
	NEW.metadata = jsonb_set(NEW.metadata, '{uuid}', to_jsonb(NEW.id));
	NEW.metadata = jsonb_set(NEW.metadata, '{uuid-sha256}', to_jsonb(id_path));
    NEW.path := '/' || substring(id_path,1,2) || '/' || substring(id_path,3,4) || '/' || substring(id_path,7,8) || '/' || substring(id_path,15) || '/' || NEW.id || '.' || (NEW.metadata->>'extension')::varchar;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER TRIGGER_PERGAMO_DOCUMENT
BEFORE INSERT ON pergamo.document FOR EACH ROW EXECUTE FUNCTION pergamo.new_document();

CREATE OR REPLACE FUNCTION document_validate_metadata(jsonb)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN ($1->>'name') IS NOT NULL AND
   		   ($1->>'extension') IS NOT NULL and
   		   ($1->>'mimetype') IS NOT null and 
   		   ($1->>'hash') IS NOT null;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE pergamo.document ADD CONSTRAINT fields_metadata_not_null CHECK (document_validate_metadata(metadata));

CREATE INDEX idx_document_metadata_hash ON PERGAMO.DOCUMENT USING HASH ((METADATA->>'hash'));