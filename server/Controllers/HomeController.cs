using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.Models;

namespace Server.Controllers
{
  public class HomeController : Controller
  {
    [HttpGet("")]
    public IActionResult Index()
    {
      return View();
    }

    [HttpGet("LeaderBoard")]
    public async Task<LeaderBoardRecord[]> GetLeaderBoard()
    {
      return await Task.Run(() =>
        LeaderBoardData.GetLeaderBoard(_GetSamplePlayers(), _GetSampleCompletedGames()));
    }

    [HttpGet("LeaderBoard/{playerId}")]
    public async Task<LeaderBoardRecord> GetLeaderBoardRecord(string playerId)
    {
      var guid = new System.Guid(playerId);
      return await Task.Run(() => LeaderBoardData.ForPlayer(guid));
    }

    [HttpPost("CompletedGame")]
    public async Task<bool> PutCompletedGame([FromBody] CompletedGame game){
      return await Task.Run(() =>
        LeaderBoardData.UpdateLeaderBoard(game));
    }

    private Player[] _GetSamplePlayers()
    {
      return new []{
        new Player() { Id = new System.Guid("57bccba1-dc47-4d08-9cf9-bccfab5c7e72"), Name = "Franko" },
        new Player() { Id = new System.Guid("a2150ecc-6f92-463c-b6d7-b263bc678dbc"), Name = "Everyone Else" },
        new Player() { Id = new System.Guid("7c26bdcc-b355-4259-98bc-419553ec289e"), Name = "Xilong" }
      };
    }

    private CompletedGame[] _GetSampleCompletedGames()
    {
      return new CompletedGame[0];
    }

    public IActionResult Error()
    {
      ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
      return View();
    }
  }
}
