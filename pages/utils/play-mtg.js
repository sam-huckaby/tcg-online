// import { connect } from 'react-redux';
// import { decrementLifeCounter, incrementLifeCounter } from '../../redux/actions/utils/mtg-tracker.actions';
import Head from 'next/head';

import MtgTracker from '../../components/utils/MtgTracker';

export default function MtgLifeCounter() {
    return (
        <div>
            <Head>
                <title>TCG Online | MTG Life Tracker Utility</title>
                <meta name="description" content="A helpful tool to track life totals in your paper Magic: The Gathering games." />
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:title" content="TCG Online | MTG Life Tracker Utility" />
                <meta
                    property="og:description"
                    content="A helpful tool to track life totals in your paper Magic: The Gathering games."
                />
            </Head>
            <MtgTracker></MtgTracker>
        </div>
        
    );
}
