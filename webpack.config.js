const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')


const NODE_ENV = process.env.NODE_ENV || 'development'

const isDebug = NODE_ENV !== 'production'

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/'
const TITLE = process.env.npm_package_keywords_0
const DESCRIPTION = process.env.npm_package_description
const KEYWORDS = []
let i = 0
let keyword = ''
while ((keyword = process.env['npm_package_keywords_' + String(i++)])) {
    KEYWORDS.push(keyword)
}
const VERSION = process.env.npm_package_version
const SOURCE_PAGE = process.env.npm_package_repository_url.match(/(https?:\/\/.+)\.git$/)[1]
const HOME_PAGE = process.env.npm_package_homepage
const AUTHOR = process.env.npm_package_author_name
const CONTACT = process.env.npm_package_author_url
const LICENSE = SOURCE_PAGE + '/blob/master/LICENSE'
const CREATE_AT = '2016-10-21T01:30:00+0800'
const UPDATE_AT = process.env.PUBLISH_DATE || new Date().toISOString()


module.exports = merge(
    require('./webpack/base'),
    isDebug ? require('./webpack/dev') : require('./webpack/prod'), {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(NODE_ENV),
                    'TITLE': JSON.stringify(TITLE),
                    'DESCRIPTION': JSON.stringify(DESCRIPTION),
                    'VERSION': JSON.stringify(VERSION),
                    'SOURCE_PAGE': JSON.stringify(SOURCE_PAGE),
                },
            }),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: 'index.html',
                html5: true,
                minify: isDebug ? false : {
                    collapseWhitespace: true
                },
                cache: isDebug,
                PUBLIC_PATH,
                TITLE,
                DESCRIPTION,
                KEYWORDS: KEYWORDS.join(', '),
                AUTHOR,
                CONTACT,
                LICENSE,
                SOURCE_PAGE,
                HOME_PAGE,
                CREATE_AT,
                UPDATE_AT
            })
        ]
    }
)
