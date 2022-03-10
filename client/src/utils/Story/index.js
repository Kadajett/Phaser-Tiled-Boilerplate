

const StoryEngine = (() => {
    let story = {
        storyState: {
        },

    };
    const init = () => {
        console.log("StoryEngine: init");
    }

    const getStoryStep = (characterId) => {
        console.log("StoryEngine: getStoryStep");
    }

    init();
    return {
        getStoryStep,
    }
})();

export default StoryEngine;