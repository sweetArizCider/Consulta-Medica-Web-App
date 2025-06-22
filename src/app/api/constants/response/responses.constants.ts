export const SUCCESS_JSON_RESPONSE = (status : number, message : string,  data : object) => {
  return {
    status: status,
    message: message,
    data: data
  };
}

export const ERROR_JSON_RESPONSE = (status : number, message : string, error : unknown | undefined) => {
  return {
    status: status,
    message: message,
    error: error
  };
}
