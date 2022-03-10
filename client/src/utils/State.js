import { CHARACTER_STATE_TRANSITIONS } from "../Constants";


const tryTransition = (oldState, newState) => {
    if (CHARACTER_STATE_TRANSITIONS[oldState].indexOf(newState) !== -1) {
        return newState;
    }
    return oldState;
}

export default tryTransition;