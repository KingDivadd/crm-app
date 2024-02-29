CREATE DATABASE pern_todo;

CREATE TABLE todo (
    todo_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    description VARCHAR(255),
    createdAt DATE DEFAULT NOW()::timestamp,
    updatedAt Date,

    person_id uuid references person(person_id)
)