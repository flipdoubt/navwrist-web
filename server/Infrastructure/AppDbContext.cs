using System.Linq;
using System.Xml.Linq;
using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Models;

namespace Server.Infrastructure
{
  public interface IAppDbContext
  {
    DbSet<Player> Players { get; }
    DbSet<CompletedGame> CompletedGames { get; }
    DbQuery<LeaderBoardRecord> LeaderBoard { get; }
    int SaveChanges();
  }

  public class AppDbContext : DbContext, IAppDbContext
  {
    public DbSet<Player> Players { get; set; }
    public DbSet<CompletedGame> CompletedGames { get; set; }
    public DbQuery<LeaderBoardRecord> LeaderBoard { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder
        .Query<LeaderBoardRecord>()
        .ToQuery(() => Players.Select(p => new LeaderBoardRecord
        {
          Player = p,
          Wins = CompletedGames.Count(g => g.WinnerId == p.Id),
          Losses = CompletedGames.Count(g => g.LoserId == p.Id)
        }));

      /*
SELECT p.*, WinCount, LossCount
FROM Players p INNER JOIN
(SELECT WinnerId, COUNT(1) WinCount FROM CompletedGames GROUP BY WinnerId) w ON p.Id = w.WinnerId INNER JOIN
(SELECT LoserId, COUNT(1) LossCount FROM CompletedGames GROUP BY LoserId) l ON p.Id = l.LoserId
       */
    }
  }
}
