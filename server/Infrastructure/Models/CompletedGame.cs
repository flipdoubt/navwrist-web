using System;
using Server.Infrastructure.Models;
namespace Server.Infrastructure.Models
{
  public class CompletedGame : IdModelBase
  {
    public System.Guid WinnerId { get; set; }
    public int WinnerScore { get; set; }
    public System.Guid LoserId { get; set; }
    public int LoserScore { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
  }
}
