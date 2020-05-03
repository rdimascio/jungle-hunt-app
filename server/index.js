import {ApolloProvider} from '@apollo/react-common'
import {ApolloClient} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import express from 'express'
import {StaticRouter} from 'react-router'
import {InMemoryCache} from 'apollo-cache-inmemory'
import { getDataFromTree } from "@apollo/react-ssr";

import Layout from './routes/Layout'

const app = express()

app.use((req, res) => {
	const client = new ApolloClient({
		ssrMode: true,
		// Remember that this is the interface the SSR server will use to connect to the
		// API server, so we need to ensure it isn't firewalled, etc
		link: createHttpLink({
			uri: 'http://localhost:3010',
			credentials: 'same-origin',
			headers: {
				cookie: req.header('Cookie'),
			},
		}),
		cache: new InMemoryCache(),
	})

	const context = {}

	// The client-side App will instead use <BrowserRouter>
	const App = (
		<ApolloProvider client={client}>
			<StaticRouter location={req.url} context={context}>
				<Layout />
			</StaticRouter>
		</ApolloProvider>
	)

	getDataFromTree(App).then(() => {
		const content = ReactDOM.renderToString(App)
		const initialState = client.extract()

		const html = <Html content={content} state={initialState} />

		res.status(200)
		res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`)
		res.end()
	})

	function Html({content, state}) {
		return (
			<html>
				<body>
					<div
						id="root"
						dangerouslySetInnerHTML={{__html: content}}
					/>
					<script
						dangerouslySetInnerHTML={{
							__html: `window.__APOLLO_STATE__=${JSON.stringify(
								state
							).replace(/</g, '\\u003c')};`,
						}}
					/>
				</body>
			</html>
		)
	}
})

app.listen(basePort, () =>
	console.log(
		// eslint-disable-line no-console
		`app Server is now running on http://localhost:${basePort}`
	)
)
