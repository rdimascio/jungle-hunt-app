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
                price,
                rank,
                rating,
                reviews,
                timestamp,
            }
        }
    }
`

const ProductChartWrapper = styled.div`
    width: 100%;
    max-width: ${window.screen.width}
	height: 400px;
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

	const datums = data
		? data.Products[0].stats.map((entry) => {
				return {
					x: new Date(entry.timestamp).setHours(0, 0, 0, 0),
					y: entry.rank,
				}
		  })
		: null

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

	const ProductChartData = React.useMemo(
		() => [
			{
				label: 'Rank',
				datums,
			},
		],
		[datums]
	)

	const onFocus = React.useCallback((datum) => {
		setState({
			primaryCursorValue: datum ? datum.primary : null,
		})
	}, [])

	if (loading) return 'Loading...'
	if (error) return `Error! ${error}`
	if (data) {
		return (
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
		)
	}
}

export default ProductChart
