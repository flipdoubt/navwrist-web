using System;

namespace Server.Models
{
  public class CompletedGame : IdModelBase
  {
    public System.Guid Winner { get; set; }
    public int WinnerScore { get; set; }
    public System.Guid Loser { get; set; }
    public int LoserScore { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
  }
}