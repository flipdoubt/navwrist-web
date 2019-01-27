using System;
using System.Collections.Generic;
using System.Linq;
using Server.Infrastructure.Models;

namespace Server.Infrastructure
{
  public class SampleData
  {
    public SampleData()
    {
      Players = _GetSamplePlayers().ToDictionary(p => p.Id);
      Games = new Dictionary<Guid, CompletedGame>();
    }

    public Dictionary<Guid, CompletedGame> Games { get; }
    public Dictionary<Guid, Player> Players { get; }

    /// <summary>
    /// TODO: Remove after data access.
    /// </summary>
    /// <returns></returns>
    private Player[] _GetSamplePlayers()
    {
      return new[]{
        new Player() { Id = new System.Guid("57bccba1-dc47-4d08-9cf9-bccfab5c7e72"), Name = "Franko" },
        new Player() { Id = new System.Guid("7c26bdcc-b355-4259-98bc-419553ec289e"), Name = "Xilong" }
      };
    }
  }
}
