import React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'
import ApolloClient from 'apollo-boost'
import Products from './components/Products'
import { ApolloProvider } from '@apollo/react-hooks'

const TOKEN = process.env.REACT_APP_JUNGLE_HUNT_API_TOKEN || ''
const client = new ApolloClient({
    uri: 'http://api.junglehunt.io',
    headers: {
        authorization: TOKEN ? `Bearer ${TOKEN}` : ''
    },
})

const ProductGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const App = () => {
    /* eslint-disable no-unused-expressions */
    return <ApolloProvider client={client}>
        <ProductGrid>
            <Products listType='newRelease' />
        </ProductGrid>
    </ApolloProvider>
}

render(<App />, document.getElementById('root'))
