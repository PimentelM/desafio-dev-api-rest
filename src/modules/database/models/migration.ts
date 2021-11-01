import {ModelDefinition} from "./index";

// Model usado para registrar a execução de migrations
let model: ModelDefinition = {
    name: `Migration`,
    schema: {
        name: {type: String, trim: true, required: true},
        lastRun: {type: Date, required: true, default: Date.now}
    }
};

export default model;
