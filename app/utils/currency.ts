export const addCommas = (input: number) => {
  const numberString = input?.toString();
  // Split the string into two parts: the integer part and the decimal part
  // console.log(numberString);
  const parts = numberString?.split(".");
  let integerPart = parts?.[0];
  const decimalPart = parts?.length > 1 ? "." + parts[1] : "";

  // Add commas to the integer part
  integerPart = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine integer part and decimal part
  return integerPart + decimalPart;
};