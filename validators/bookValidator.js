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
    title: Joi.string().min(3).optional(),
    author: Joi.string().min(3).optional(),
    publicationYear: Joi.number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear())
      .optional(),
    genre: Joi.string().optional(),
    price: Joi.number().optional(),
  }).required().unknown(false),

  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }).required(),

  query: Joi.object().optional(),
});

export const getOrDeleteByIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }).required(),
  body: Joi.object().optional(),
  query: Joi.object().optional(),
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
