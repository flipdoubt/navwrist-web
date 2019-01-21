using System;

namespace Server.Models
{
  public class LeaderBoardRecord
  {

    public Player Player { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public decimal Score => LeaderBoardRecord.CalculateScore(Wins, Losses);

    public static decimal CalculateScore(int wins, int losses)
    {
      decimal total = wins + losses;
      if (total == 0) return 0M;
      return wins / total;
    }
  }
}