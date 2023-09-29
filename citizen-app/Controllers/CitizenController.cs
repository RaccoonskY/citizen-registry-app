using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace citizen_app.Controllers
{
    public class CitizenController : Controller
    {
        ICitizenDbContext context;
        public CitizenController()
        {

            this.context = new CitizenDbContext();
        }
        public CitizenController(ICitizenDbContext dbContext) { 
        
            this.context = dbContext;
        }

        // GET: Controller
        public ActionResult Index()
        {
            return View();
        }
    }
}