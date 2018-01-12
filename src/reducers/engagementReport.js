const initialState = {
  chart: {
    data: {},
    error: null,
    loading: false
  }
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'GET_ENGAGEMENT_CHART_DATA_FAIL':
      return { ...state, chart: { data: [], error: payload, loading: false }};
    case 'GET_ENGAGEMENT_CHART_DATA_PENDING':
      return { ...state, chart: { data: state.chart.data, error: null, loading: true }};
    case 'GET_ENGAGEMENT_CHART_DATA_SUCCESS':
      return { ...state, chart: { data: payload[0], error: null, loading: true }};
    default:
      return state;
  }
};
