import Joi from "joi";

export const createBookSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    author: Joi.string().min(1).max(120).required(),
    description: Joi.string().allow("").max(2000),
    price: Joi.number().min(0).required(),
    coverImage: Joi.string().uri().allow(""),
    publishedYear: Joi.number().integer().min(0).max(new Date().getFullYear()).optional(),
    available: Joi.boolean().optional()
  }),
  params: Joi.object({}),
  query: Joi.object({})
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
