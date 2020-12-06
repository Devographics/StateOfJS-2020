require('dotenv').config()

module.exports = {
    siteMetadata: {
        title: `The State Of JS`
    },
    plugins: [
        'gatsby-transformer-yaml',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: `data`,
                path: `${__dirname}/src/data/`
            }
        },
        {
            resolve: 'gatsby-source-graphql',
            options: {
                typeName: 'SurveyApi',
                fieldName: 'surveyApi',
                url: process.env.API_URL
            }
        },
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-sass',
        'gatsby-plugin-netlify',
        'gatsby-plugin-styled-components'
        // 'gatsby-plugin-webpack-bundle-analyzer',
    ]
}
