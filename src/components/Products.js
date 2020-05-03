import React from 'react'
import gql from 'graphql-tag'
import styled from 'styled-components'
import {useQuery} from '@apollo/react-hooks'
import {Link, useRouteMatch} from 'react-router-dom'

const PRODUCTS = ({collection, limit, offset}) => gql`
    {
        Products(collection: "${collection}", limit: ${limit}, offset: ${offset}) {
            asin,
            title,
            category {
                primary,
                secondary
            },
            image,
            price,
            rating,
            reviews,
            rank,
        }
    }
`

const ProductWrapper = styled.div`
	width: 30%;
`

const ProductImage = styled.div`
    padding-bottom: 100%;
    background-position: center;
    background-size: contain;
    background-image: url('${(props) => props.background}');
`

const Products = (props) => {
	const {loading, error, data} = useQuery(
		PRODUCTS({
			collection: props.listType || 'bestSeller',
			limit: 24,
			offset: 0,
		}),
		{
			// variables: { collection: listType || 'bestSeller' }
		}
	)

	let {url} = useRouteMatch()

	if (loading) return 'Loading...'
	if (error) return `Error! ${error}`

	return data.Products.map((product) => {
		/* eslint-disable no-unused-expressions */
		return (
			<ProductWrapper key={product.asin}>
				<ProductImage background={product.image}></ProductImage>
				<Link to={`${url}/${product.asin}`}>
					<p>{product.title}</p>
				</Link>
			</ProductWrapper>
		)
	})
}

export default Products
