import { DECREMENT_LIFE_COUNTER, INCREMENT_LIFE_COUNTER } from '../../actions/utils/mtg-tracker.actions';

const mtgTrackerReducer = (state = { value: 0 }, action) => {
    console.log(action);
    switch (action.type) {
        case INCREMENT_LIFE_COUNTER:
            return { ...state, value: state.value + 1 };
        case DECREMENT_LIFE_COUNTER:
            return { ...state, value: state.value - 1 };
        default:
            return { ...state };
    }
};

export default mtgTrackerReducer;