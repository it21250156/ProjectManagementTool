export const fetchDelayProbability = async (userId) => {
  const response = await fetch(`/api/delay-probability/user/${userId}`);
  const data = await response.json();
  return data;
};
