export const validateUserName = (userName: string): string | undefined => {
  if (userName.length < 3) {
    return "Username has to be atleast length 3";
  }
};

export const vaildatePassword = (password: string): string | undefined => {
  if (password.length < 3) {
    return "Password has to be atleast length 3";
  }
};
