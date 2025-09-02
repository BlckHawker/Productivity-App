//todo add file header
import * as utils from "./utils.js";

//todo add header comment
const getAllTasks = async () => {
    const response = await utils.getAPICall("/task");
    if (response.message) {
        return new Error(response.message);
    }
    return response;
};

//todo add header comment
const createTask = async (name: string) => {
  const response = await utils.postAPICall("/createTask", {name, complete: false});
  if(response.message) {
    return new Error(response.message);
  }
  return response;
};

export {
  getAllTasks,
  createTask
};