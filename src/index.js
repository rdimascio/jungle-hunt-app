import React from 'react'
import {render} from 'react-dom'
import styled from 'styled-components'

import ApolloClient from 'apollo-boost'
import {ApolloProvider} from '@apollo/react-hooks'

import Products from './components/Products'
import ProductChart from './components/ProductChart'

const TOKEN = process.env.REACT_APP_JUNGLE_HUNT_API_TOKEN || ''
const client = new ApolloClient({
	uri:
		process.env.REACT_APP_NODE_ENV === 'development'
			? 'http://localhost:8080/api'
			: 'http://api.junglehunt.io',
	headers: {
		authorization: TOKEN ? `Bearer ${TOKEN}` : '',
	},
})

const ProductGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
	justify-content: space-between;
`

const ProductChartRow = styled.div`
	display: flex;
	width: 100%;
`

const ProductChartWrapper = styled.div`
	padding: 20px;
	flex: 1;
`

const App = () => {
	/* eslint-disable no-unused-expressions */
	// return <ApolloProvider client={client}>
	//     <ProductGrid>
	//         <Products />
	//     </ProductGrid>
	// </ApolloProvider>

	return <ApolloProvider client={client}>
		<ProductChartRow>
			<ProductChartWrapper>
				<ProductChart asin={'B00RH5K26I'} metric="rank" />
			</ProductChartWrapper>
			<ProductChartWrapper>
				<ProductChart asin={'B00RH5K26I'} metric="reviews" />
			</ProductChartWrapper>
		</ProductChartRow>
		<ProductChartRow>
			<ProductChartWrapper>
				<ProductChart asin={'B00RH5K26I'} metric="rating" />
			</ProductChartWrapper>
			<ProductChartWrapper>
				<ProductChart asin={'B00RH5K26I'} metric="price" />
			</ProductChartWrapper>
		</ProductChartRow>
	</ApolloProvider>
}

render(<App />, document.getElementById('root'))
