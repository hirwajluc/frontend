export function usePrizeOverview() {
  /**
   * Calculates the overview of the prize data array
   * @param prizes - Array of prize objects
   * @returns An overview object with total prize amount, total count, remaining count, and unique prize types
   */
  const calculateOverview = (
    prizes: Array<{
      total_prize: number;
      prize_count: number;
      total_elligibility: number;
      prize_type: string;
    }>
  ) => {
    const totalPrizeAmount = prizes.reduce(
      (sum, prize) => sum + prize.total_prize,
      0
    );
    const totalCount = prizes.reduce(
      (sum, prize) => sum + prize.prize_count,
      0
    );
    const totalEligibility = prizes.reduce(
      (sum, prize) => sum + prize.total_elligibility,
      0
    );

    

    // Calculate remaining count as total eligibility - total count
    const remainingCount = totalEligibility - totalCount;

    // Get unique prize types
    const prizeTypes = [...new Set(prizes.map((prize) => prize.prize_type))];

    return {
      totalPrizeAmount,
      totalCount,
      remainingCount,
      prizeTypes,
    };
  };

  return {
    calculateOverview,
  };
}
