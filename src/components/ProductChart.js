import React from 'react'
import gql from 'graphql-tag'
import styled from 'styled-components'
import {Chart} from 'react-charts'
import {useQuery} from '@apollo/react-hooks'

// start: "${start}", end: "${end}"

const STATS = ({asin, collection}) => gql`
    {
        Products(collection: "${collection}", asin: "${asin}", stats: true) {
            stats {
				category,
                price,
                rank,
                rating,
                reviews,
                timestamp,
            }
        }
    }
`

const ProductChartContainer = styled.div`
	flex: 1;
	height: 240px;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 5px 10px rgba(25, 25, 25, 0.05);
	border: 1px solid #efefef;
	background: #fff;
`

const ProductChartTitle = styled.h1`
	margin: 0 0 20px;
	font-size: 16px;
	line-height: 20px;
`

const ProductChartWrapper = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	height: 200px;
	overflow: hidden;

	.Voronoi {
		cursor: crosshair;
	}
`

const ProductChart = (props) => {
	const {loading, error, data} = useQuery(
		STATS({
			asin: props.asin,
			collection: props.listType || 'bestSeller',
			// start: props.start || '12/01/2018',
			// end: props.end || new Date().toLocaleString(),
		}),
		{
			// variables: { start, end }
		}
	)

	const [{primaryCursorValue}, setState] = React.useState({
		primaryCursorValue: null,
	})

	const ProductChartCategories = data
		? [
				...new Set(
					data.Products[0].stats.map((entry) => entry.category)
				),
		  ].filter(Boolean)
		: null

	const ProductChartSets = data
		? [
				...ProductChartCategories.map((category, index) => {
					if (props.metric !== 'rank' && index > 0) {
						return null
					}

					return {
						label:
							props.metric === 'rank'
								? category
								: props.metric[0].toUpperCase() +
								  props.metric.slice(1),
						datums: data.Products[0].stats
							.map((entry) => {
								if (entry.category !== category) {
									return false
								}

								return {
									x: new Date(entry.timestamp).setHours(
										0,
										0,
										0,
										0
									),
									y:
										props.metric === 'price'
											? entry.price
													?.replace('$', '')
													?.split(' ')[0] ?? null
											: entry[props.metric],
								}
							})
							.filter(Boolean),
					}
				}),
		  ].filter(Boolean)
		: null

	if (props.metric === 'price' && data) {
		console.log(ProductChartSets)
	}

	const ProductChartSeries = React.useMemo(
		() => ({
			type: 'line',
			showPoints: false,
		}),
		[]
	)

	const primaryCursor = React.useMemo(
		() => ({
			value: primaryCursorValue,
		}),
		[primaryCursorValue]
	)

	const ProductChartAxes = React.useMemo(
		() => [
			{
				primary: true,
				position: 'bottom',
				type: 'time',
			},
			{position: 'left', type: 'linear'},
		],
		[]
	)

	const ProductChartData = React.useMemo(() => ProductChartSets, [
		ProductChartSets,
	])

	const onFocus = React.useCallback((datum) => {
		setState({
			primaryCursorValue: datum ? datum.primary : null,
		})
	}, [])

	if (loading || !data) {
		return (
			<ProductChartContainer>
				<p>Loading...</p>
			</ProductChartContainer>
		)
	}

	if (error) console.log(error)

	if (data) {
		return (
			<ProductChartContainer>
				<ProductChartTitle>
					{props.metric[0].toUpperCase() + props.metric.slice(1)}
				</ProductChartTitle>
				<ProductChartWrapper>
					<Chart
						data={ProductChartData}
						series={ProductChartSeries}
						axes={ProductChartAxes}
						onFocus={onFocus}
						primaryCursor={primaryCursor}
						tooltip
					/>
				</ProductChartWrapper>
			</ProductChartContainer>
		)
	}
}

export default ProductChart
