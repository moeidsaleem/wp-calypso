/**
 * External dependencies
 */
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { isRequestingBillingData } from 'state/billing-data/selectors';
import { requestBillingData } from 'state/billing-data/actions';

class QueryBillingData extends Component {
	static propTypes = {
		requestingBillingData: PropTypes.bool,
		requestBillingData: PropTypes.func
	};

	componentWillMount() {
		if ( this.props.requestingBillingData ) {
			return;
		}

		this.props.requestBillingData();
	}

	render() {
		return null;
	}
}

export default connect(
	( state ) => ( {
		requestingBillingData: isRequestingBillingData( state )
	} ),
	{ requestBillingData }
)( QueryBillingData );
