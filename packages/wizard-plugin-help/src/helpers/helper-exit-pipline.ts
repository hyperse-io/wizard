import { HelperExitPipelineException } from '../errors/HelperExitPipelineException.js';

export const exitPipeline = () => {
  throw new HelperExitPipelineException();
};
