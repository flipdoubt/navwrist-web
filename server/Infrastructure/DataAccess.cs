using System.Collections.Generic;
using System.Linq;
using Server.Infrastructure.Models;

namespace Server.Infrastructure
{
  public class DataAccess : IDataAccess
  {
    private readonly IAppDbContext _db;

    public DataAccess(IAppDbContext db)
    {
      _db = db;
    }

    public LeaderBoardRecord[] GetLeaderBoard()
    {
      return _db.LeaderBoard.OrderBy(b => b.Score).ToArray();
    }

    public LeaderBoardRecord GetLeaderBoardRecord(System.Guid playerId)
    {
      var record = GetLeaderBoard().FirstOrDefault(r => r.Player.Id == playerId) ?? new LeaderBoardRecord();
      return record;
    }

    public bool SaveCompletedGame(CompletedGame game)
    {
      if (!_db.Players.Any(p => p.Id == game.WinnerId) || !_db.Players.Any(p => p.Id == game.LoserId) ||
          _db.CompletedGames.Any(g => g.Id == game.Id)) return false;

      _db.CompletedGames.Add(game);
      _db.SaveChanges();
      return true;
    }

    public bool SavePlayer(Player player)
    {
      var existing = _db.Players.FirstOrDefault(p => p.Id == player.Id);

      if (existing != null)
      {
        existing.Name = player.Name;
        _db.Players.Update(existing);
      }
      else
      {
        _db.Players.Add(player);
      }

      _db.SaveChanges();
      return true;
    }
  }

  public interface IDataAccess
  {
    LeaderBoardRecord[] GetLeaderBoard();
    LeaderBoardRecord GetLeaderBoardRecord(System.Guid playerId);
    bool SaveCompletedGame(CompletedGame game);
    bool SavePlayer(Player player);
  }
}
