/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { flowRight } from 'lodash';

/**
 * Internal dependencies
 */
import SummaryChart from '../stats-summary';
import QuerySiteStats from 'components/data/query-site-stats';
import { getSiteStatsNormalizedData, isRequestingSiteStatsForQuery } from 'state/stats/lists/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';

class StatsVideoSummary extends Component {
	static propTypes = {
		query: PropTypes.object,
		isRequesting: PropTypes.bool,
		siteId: PropTypes.number,
		summaryData: PropTypes.array,
	}

	state = {
		selectedBar: null
	};

	componentWillReceiveProps( nextProps ) {
		const chartDataLength = nextProps.summaryData ? nextProps.summaryData.length : null;
		// Always default to the last bar being selected
		if ( ! this.state.selectedBar && chartDataLength ) {
			this.setState( {
				selectedBar: nextProps.summaryData[ chartDataLength - 1 ]
			} );
		}
	}

	selectBar = bar => {
		this.setState( {
			selectedBar: bar
		} );
	};

	render() {
		const { query, isRequesting, moment, siteId, summaryData, translate } = this.props;
		const data = summaryData.map( item => {
			return {
				...item,
				period: moment( item.period ).format( 'MMM D' ),
			};
		} );
		let selectedBar = this.state.selectedBar;
		if ( ! selectedBar && !! data.length ) {
			selectedBar = data[ data.length - 1 ];
		}

		return (
			<div>
				<QuerySiteStats siteId={ siteId } statType="statsVideo" query={ query } />
				<SummaryChart
					isLoading={ isRequesting && ! summaryData.length }
					data={ data }
					activeKey="period"
					dataKey="value"
					labelKey="period"
					labelClass="video"
					sectionClass="is-video"
					selected={ selectedBar }
					onClick={ this.selectBar }
					tabLabel={ translate( 'Plays' ) }
				/>
			</div>
		);
	}
}

const connectComponent = connect(
	( state, { postId } ) => {
		const query = { postId };
		const siteId = getSelectedSiteId( state );

		return {
			summaryData: getSiteStatsNormalizedData( state, siteId, 'statsVideo', query ) || [],
			isRequesting: isRequestingSiteStatsForQuery( state, siteId, 'statsVideo', query ),
			query,
			siteId,
		};
	}
);

export default flowRight(
	connectComponent,
	localize,
)( StatsVideoSummary );
