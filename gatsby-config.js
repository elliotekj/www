const defaults = require(`./utils/default-options`)
const newsletterFeed = require(`./src/utils/newsletterFeed`)

module.exports = {
	siteMetadata: {
		...defaults,
		siteTitle: `Elliot Jackson`,
		siteTitleAlt: `Elliot Jackson: Freelance software designer and developer`,
		siteHeadline: `Elliot Jackson: Freelance software designer and developer`,
		siteUrl: `https://elliotekj.com`,
		siteDescription: `I'm Elliot Jackson; I build software for fun and profit. Currently I freelance, taking on mainly iOS design and/or development projects. Prior to that I worked at Realmac Software.`,
		siteLanguage: `en`,
		siteImage: `/banner.jpg`,
		author: `@lekoarts_de`,
		externalLinks: [
		{
			name: `Hire Me`,
			url: `http://inthefield.co`
		},
		{
			name: `GitHub`,
			url: `https://github.com/elliotekj`
		},
		{
			name: `Dribbble`,
			url: `https://dribbble.com/elliotekj`
		}
		],
		navigation: [
		{
			title: `Blog`,
			slug: `/blog`,
		},
		{
			title: `About`,
			slug: `/about`,
		},
		],
		showLineNumbers: true,
		mdx: true
	},
	plugins: [
	{
		resolve: `gatsby-source-filesystem`,
		options: {
			name: defaults.postsPath,
			path: defaults.postsPath,
		},
	},
	{
		resolve: `gatsby-source-filesystem`,
		options: {
			name: defaults.pagesPath,
			path: defaults.pagesPath,
		},
	},
	{
		resolve: `gatsby-plugin-mdx`,
		options: {
			gatsbyRemarkPlugins: [
			{
				resolve: `gatsby-remark-images`,
				options: {
					maxWidth: 960,
					quality: 90,
					linkImagesToOriginal: false,
				},
			},
			],
			plugins: [
			{
				resolve: `gatsby-remark-images`,
				options: {
					maxWidth: 960,
					quality: 90,
					linkImagesToOriginal: false,
				},
			},
			],
		},
	},
	`gatsby-transformer-sharp`,
	`gatsby-plugin-sharp`,
	`gatsby-plugin-typescript`,
	{
		resolve: `gatsby-plugin-feed`,
		options: newsletterFeed,
	},
	`gatsby-plugin-react-helmet`,
	`gatsby-plugin-typescript`,
	`gatsby-plugin-catch-links`,
	`gatsby-plugin-theme-ui`,
	{
		resolve: `gatsby-plugin-google-analytics`,
		options: {
			trackingId: "null",
		},
	},
	`gatsby-plugin-sitemap`,
	{
		resolve: `gatsby-plugin-manifest`,
		options: {
			name: `minimal-blog - @lekoarts/gatsby-theme-minimal-blog`,
			short_name: `minimal-blog`,
			description: `Typography driven, feature-rich blogging theme with minimal aesthetics. Includes tags/categories support and extensive features for code blocks such as live preview, line numbers, and code highlighting.`,
			start_url: `/`,
			background_color: `#fff`,
			theme_color: `#6B46C1`,
			display: `standalone`,
			icons: [
			{
				src: `/android-chrome-192x192.png`,
				sizes: `192x192`,
				type: `image/png`,
			},
			{
				src: `/android-chrome-512x512.png`,
				sizes: `512x512`,
				type: `image/png`,
			},
			],
		},
	},
	`gatsby-plugin-offline`,
	`gatsby-plugin-netlify`,
	],
}
