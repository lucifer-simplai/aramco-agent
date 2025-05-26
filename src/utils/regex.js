export const nonZeroPositiveInteger = /^[1-9]\d*$/;
export const passwordPattern =
  /^(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/;
export const alphanumericWithUnderscore = /^[a-zA-Z0-9_]+$/;
export const alphanumericWithUnderscoreSpace = /^[a-zA-Z0-9_ ]+$/;
export const variablePattern = /\{\{([^}]+)\}\}/g;
export const positiveDecimalNumberWithOrWithoutleadingZero =
  /^(0*[1-9]\d*(\.\d+)?|0+\.\d*[1-9]\d*)$/;
export const imageUrlPattern =
  /^(https?:\/\/|ftp:\/\/|file:\/\/|data:image\/|\/\/|\.\/|\.\.\/|\/)?(.*\.(?:png|jpg|jpeg|gif|bmp|webp|svg))$/i;
