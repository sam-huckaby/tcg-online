//Action Types
export const INCREMENT_LIFE_COUNTER = "INCREMENT_LIFE_COUNTER";
export const DECREMENT_LIFE_COUNTER = "DECREMENT_LIFE_COUNTER";


//Action Creator
export const incrementLifeCounter = () => ({
   type: INCREMENT_LIFE_COUNTER
});

export const decrementLifeCounter = () => ({
    type: DECREMENT_LIFE_COUNTER
});