import DefaultTheme from 'vitepress/theme';
import './custom.css';

import UsageLedger from './components/UsageLedger.vue';
import MultiplierCalculator from './components/MultiplierCalculator.vue';
import ResetTimeline from './components/ResetTimeline.vue';
import PaygComparator from './components/PaygComparator.vue';
import TrafficEstimator from './components/TrafficEstimator.vue';
import VideoEstimator from './components/VideoEstimator.vue';
import DeviceAggregator from './components/DeviceAggregator.vue';
import ReconciliationPanel from './components/ReconciliationPanel.vue';
import EvidenceBadge from './components/EvidenceBadge.vue';
import DecisionTree from './components/DecisionTree.vue';
import FAQ from './components/FAQ.vue';
import MainSiteCTA from './components/MainSiteCTA.vue';
import Disclosure from './components/Disclosure.vue';
import AuthorByline from './components/AuthorByline.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('UsageLedger', UsageLedger);
    app.component('MultiplierCalculator', MultiplierCalculator);
    app.component('ResetTimeline', ResetTimeline);
    app.component('PaygComparator', PaygComparator);
    app.component('TrafficEstimator', TrafficEstimator);
    app.component('VideoEstimator', VideoEstimator);
    app.component('DeviceAggregator', DeviceAggregator);
    app.component('ReconciliationPanel', ReconciliationPanel);
    app.component('EvidenceBadge', EvidenceBadge);
    app.component('DecisionTree', DecisionTree);
    app.component('FAQ', FAQ);
    app.component('MainSiteCTA', MainSiteCTA);
    app.component('Disclosure', Disclosure);
    app.component('AuthorByline', AuthorByline);
  }
};
