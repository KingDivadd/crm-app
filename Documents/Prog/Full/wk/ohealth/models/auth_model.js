const Joi = require('joi')

const authSchema = Joi.object({
    auth_id: Joi.string().uuid().required(),
    unique_code: Joi.number().integer(),
    password: Joi.string().required(),
    person_id: Joi.string().uuid().required(),

    created_at: Joi.date().required()
})

module.exports = authSchema

// -- CREATE DATABASE pern_chat_app

// CREATE TABLE auth (
//     auth_id  uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
//     unique_code  VARCHAR(6) NOT NULL,
//     password  VARCHAR(200) NOT NULL,
//     chat_user_id  uuid references chat_user (chat_user_id),


//     createdAt DATE DEFAULT NOW()::timestamp NOT NULL,
//     updatedAt DATE DEFAULT NOW()::timestamp NOT NULL
// );


// // Define the first model
// model User {
//   id        Int      @id @default(autoincrement())
//   username  String
//   email     String   @unique
//   posts     Post[]
// }

// // Define the second model with a reference to the User model
// model Post {
//   id        Int      @id @default(autoincrement())
//   title     String
//   content   String
//   author    User?    @relation(fields: [authorId], references: [id])
//   authorId  Int?
// }