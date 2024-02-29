CREATE TABLE person (
    person_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(12) ,
    createdAt DATE DEFAULT NOW()::timestamp,
    updatedAt Date,

    UNIQUE(email)
)