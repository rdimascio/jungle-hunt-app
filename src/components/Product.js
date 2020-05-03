import React from 'react'
import styled from 'styled-components'
import { useParams } from "react-router-dom";

import ProductChart from './ProductChart'

const ProductChartRow = styled.div`
	display: flex;
	width: 100%;
`

const ProductChartWrapper = styled.div`
	padding: 20px;
	flex: 1;
`

export default () => {
	let { asin } = useParams()

	return (
        <div>
            <ProductChartRow>
                <ProductChartWrapper>
                    <ProductChart asin={asin} metric="rank" />
                </ProductChartWrapper>
                <ProductChartWrapper>
                    <ProductChart asin={asin} metric="reviews" />
                </ProductChartWrapper>
            </ProductChartRow>
            <ProductChartRow>
                <ProductChartWrapper>
                    <ProductChart asin={asin} metric="rating" />
                </ProductChartWrapper>
                <ProductChartWrapper>
                    <ProductChart asin={asin} metric="price" />
                </ProductChartWrapper>
            </ProductChartRow>
        </div>
	)
}
