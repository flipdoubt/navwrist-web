using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.Infrastructure;

namespace Server.Features.Home
{
  public class HomeController : Controller
  {
    private readonly IDataAccess _data;

    public HomeController()
    {
      _data = new DataAccess();
    }
    [HttpGet("")]
    public IActionResult Index()
    {
      return View();
    }

    [HttpGet("LeaderBoard")]
    public async Task<LeaderBoardRecord[]> GetLeaderBoard()
    {
      return await Task.Run(() => _data.GetLeaderBoard());
    }

    [HttpGet("LeaderBoard/{playerId}")]
    public async Task<LeaderBoardRecord> GetLeaderBoardRecord(string playerId)
    {
      var guid = new System.Guid(playerId);
      return await Task.Run(() => _data.GetLeaderBoardRecord(guid));
    }

    [HttpPost("CompletedGame")]
    public async Task<bool> PutCompletedGame([FromBody] CompletedGame game)
    {
      return await Task.Run(() => _data.SaveCompletedGame(game));
    }

    [HttpPost("Player")]
    public async Task<bool> PutPlayer([FromBody] Player player)
    {
      return await Task.Run(() => _data.SavePlayer(player));
    }

    public IActionResult Error()
    {
      ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
      return View();
    }
  }
}
