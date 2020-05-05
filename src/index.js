import React from 'react'
import {render} from 'react-dom'
import styled from 'styled-components'
import {ApolloClient} from 'apollo-client'
import {InMemoryCache, NormalizedCacheObject} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import {ApolloProvider} from '@apollo/react-hooks'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useRouteMatch,
} from 'react-router-dom'

import Products from './components/Products'
import Product from './components/Product'

const TOKEN = process.env.REACT_APP_JUNGLE_HUNT_API_TOKEN || ''
const cache = new InMemoryCache()
const link = new HttpLink({
	uri: `${process.env.REACT_APP_JUNGLE_HUNT_API}/products`,
})
const client = new ApolloClient({
	link,
	cache,
	credentials: 'include',
	headers: {
		authorization: TOKEN ? `Bearer ${TOKEN}` : '',
	},
})

const ProductGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
`

const App = () => {
	return (
		<Router>
			<div>
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route path={`/login`}>
						<a href={`${REACT_APP_JUNGLE_HUNT_API}/auth/amazon`}>Login with Amazon!</a>
					</Route>
					<Route path={`/products`}>
						<Asins />
					</Route>
				</Switch>
			</div>
		</Router>
	)
}

function Home() {
	return (
		<div>
			<h2>Home</h2>
		</div>
	)
}

function Asins() {
	let {path} = useRouteMatch()

	return (
		<div>
			<Switch>
				<Route exact path={path}>
					<ApolloProvider client={client}>
						<ProductGrid>
							<Products />
						</ProductGrid>
					</ApolloProvider>
				</Route>
				<Route path={`${path}/:asin`}>
					<ApolloProvider client={client}>
						<Product />
					</ApolloProvider>
				</Route>
			</Switch>
		</div>
	)
}

render(<App />, document.getElementById('root'))
