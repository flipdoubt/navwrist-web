using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

  public static class LeaderBoardData
  {
    private static List<LeaderBoardRecord> _data;
    public static LeaderBoardRecord[] GetLeaderBoard(IEnumerable<Player> players, IEnumerable<CompletedGame> completedGames)
    {
      if (_data != null) return _data.ToArray();
      System.Diagnostics.Debug.WriteLine("Creating _data.");
      var dictionary = players.Select(p => new LeaderBoardRecord { Player = p }).ToDictionary(r => r.Player.Id);
      foreach (var game in completedGames)
      {
        var winner = dictionary[game.Winner];
        if (winner != null) winner.Wins++;
        var loser = dictionary[game.Loser];
        if (loser != null) loser.Losses++;
      }
      _data = dictionary.Values.ToList();
      return _data.ToArray();
    }

    internal static LeaderBoardRecord ForPlayer(System.Guid playerId)
    {
      var record = _data?.FirstOrDefault(r => r.Player.Id == playerId) ?? new LeaderBoardRecord();
      if (record.Player.Name == "Franko")
      {
        Task.Delay(3000).Wait(); // Pause for Franko.
      }
      return record;
    }

    internal static bool UpdateLeaderBoard(CompletedGame game)
    {
      if (_data == null) return false;
      var winner = _data.FirstOrDefault(d => d.Player.Id == game.Winner);
      if (winner != null) winner.Wins++;
      var loser = _data.FirstOrDefault(d => d.Player.Id == game.Loser);
      if (loser != null) loser.Losses++;
      return true;
    }
  }
}