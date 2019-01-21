using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.Models;

namespace Server
{
  public class DataAccess : IDataAccess
  {
    private static SampleData _data = new SampleData();
    public LeaderBoardRecord[] GetLeaderBoard()
    {
      return GetLeaderBoard(_data.Players.Select(p => p.Value), _data.Games.Select(g => g.Value));
    }

    public static LeaderBoardRecord[] GetLeaderBoard(IEnumerable<Player> players, IEnumerable<CompletedGame> completedGames)
    {
      var dictionary = players.Select(p => new LeaderBoardRecord { Player = p }).ToDictionary(r => r.Player.Id);
      foreach (var game in completedGames)
      {
        var winner = dictionary[game.Winner];
        if (winner != null) winner.Wins++;
        var loser = dictionary[game.Loser];
        if (loser != null) loser.Losses++;
      }
      return dictionary.Values.ToArray();
    }

    public LeaderBoardRecord GetLeaderBoardRecord(System.Guid playerId)
    {
      var record = GetLeaderBoard().FirstOrDefault(r => r.Player.Id == playerId) ?? new LeaderBoardRecord();
      // Tests concurrency by making one query longer than the others.
      // if (record.Player.Name == "Franko")
      // {
      //   Task.Delay(3000).Wait(); // Pause for Franko.
      // }
      return record;
    }

    public bool SaveCompletedGame(CompletedGame game)
    {
      if (!_data.Players.ContainsKey(game.Winner) || !_data.Players.ContainsKey(game.Loser) || _data.Games.ContainsKey(game.Id))
        return false;

      _data.Games.Add(game.Id, game);
      return true;
    }

    public bool SavePlayer(Player player)
    {
      if (_data.Players.ContainsKey(player.Id))
      {
        _data.Players[player.Id] = player;
      }
      else
      {
        _data.Players.Add(player.Id, player);
      }
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