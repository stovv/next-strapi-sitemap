const axios = require('axios');

const base_api = axios.create({
    baseURL: process.env.BACKEND_HOST !== undefined
        ? process.env.BACKEND_HOST
        : process.env.NEXT_PUBLIC_BACKEND,
    headers:{ 'Content-Type': 'application/json'}
});

const api = {
    ql: (query, additional_data = null) => {
        return base_api.post('/graphql', {
                ...additional_data,
                query: query,
            },
            {
                transformResponse: [function (data) {
                    return JSON.parse(data).data;
                }]
            }
        )
    },
    ...base_api
}

module.exports = {
    fetchPosts: (fields = ['id', 'slug', 'updated_at'], start, limit) => {
        return api.ql(`
            query{
                posts${start !== undefined || limit !== undefined ? `(${(start !== undefined ? `start:${start},` : '')}${(limit !== undefined ? `limit:${limit}` : '')}, sort: "published_at:DESC")`: ''}{
                    ${fields.join(',\n')}
                }
            }
        `);
    },
    fetchCategories: (fields = ['id', 'slug', 'updated_at']) => {
        return api.ql(`
        query{
            categories{
                ${fields.join(',\n')}
            }
        }
        `);
    }
}