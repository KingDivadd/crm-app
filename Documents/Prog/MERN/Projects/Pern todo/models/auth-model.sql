CREATE TABLE auth (
    auth_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    password VARCHAR(100) NOT NULL,
    unique_code VARCHAR(7),

    createdAt DATE DEFAULT NOW()::timestamp,
    updatedAt Date,

    person_id uuid references person(person_id)
)