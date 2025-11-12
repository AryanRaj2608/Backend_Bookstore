import Joi from "joi";

export const createBookSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
    description: Joi.string().allow("").optional(),
    // accept the name you used in Postman: 'publicationYear'
    publicationYear: Joi.number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear())
      .optional(),

    // also allow publishedYear if you used that name elsewhere
    publishedYear: Joi.number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear())
      .optional(),

    genre: Joi.string().optional(),

    price: Joi.number().required(),

    coverImage: Joi.string().uri().optional(),

    available: Joi.boolean().optional(),
  }).required(),

  params: Joi.object().optional(),
  query: Joi.object().optional(),
});

export const updateBookSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(1).max(200),
    author: Joi.string().min(1).max(120),
    description: Joi.string().allow("").max(2000),
    price: Joi.number().min(0),
    coverImage: Joi.string().uri().allow(""),
    publishedYear: Joi.number().integer().min(0).max(new Date().getFullYear()),
    available: Joi.boolean()
  }).min(1), // must send at least one field
  params: Joi.object({ id: Joi.string().length(24).hex().required() }),
  query: Joi.object({})
});

export const getOrDeleteByIdSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({ id: Joi.string().length(24).hex().required() }),
  query: Joi.object({})
});

export const listBooksSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({
    q: Joi.string().allow(""),
    sortBy: Joi.string().valid("title", "author", "price", "createdAt").default("createdAt"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  })
});
