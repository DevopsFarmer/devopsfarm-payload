import { CollectionConfig } from 'payload';

const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req }: { req: any }) => Boolean(req.user),
    update: ({ req }: { req: any }) => Boolean(req.user),
    delete: ({ req }: { req: any }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'categories',
      type: 'array',
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
        },
        {
          name: 'questions',
          type: 'array',
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
            },
            {
              name: 'options',
              type: 'array',
              fields: [
                {
                  name: 'option',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'correctAnswer',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'number',
              required: true,
              min: 0,
              max: 100,
            },
          ],
        },

      ],
    },
  ],
};

export default Quizzes;





// //quizzes.ts
// import { CollectionConfig } from 'payload';

// const Quizzes: CollectionConfig = {
//   slug: 'quizzes',
//   admin: {
//     useAsTitle: 'title',
//   },
//   access: {
//     read: () => true,
//     create: ({ req }:{req:any}) => Boolean(req.user), 
//     update: ({ req }:{req:any}) => Boolean(req.user), 
//     delete: ({ req }:{req:any}) => Boolean(req.user), 
//   },
//   fields: [
//     {
//       name: 'title',
//       type: 'text',
//       required: true,
//     },
//     {
//       name: 'questions',
//       type: 'array',
//       fields: [
//         {
//           name: 'question',
//           type: 'text',
//           required: true,
//         },
//         {
//           name: 'options',
//           type: 'array',
//           fields: [
//             {
//               name: 'option',
//               type: 'text',
//               required: true,
//             },
//           ],
//         },
//         {
//           name: 'correctAnswer',
//           type: 'text',
//           required: true,
//         },
//       ],
//     },
//   ],
// };

// export default Quizzes;
