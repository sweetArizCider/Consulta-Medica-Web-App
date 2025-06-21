
export const saveTokenToLocalStorage = (token : string ) : void => {
  localStorage.setItem('JWT', token);
}

export const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('JWT');
}
