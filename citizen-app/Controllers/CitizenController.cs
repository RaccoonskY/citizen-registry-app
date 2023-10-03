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


        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetAll()
        {
            var citizensList = context.GetCitizens();
            return Json(citizensList, JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public ActionResult Get(int id)
        {
            var citizen = context.GetCitizen(id);
            return Json(citizen, JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public ActionResult Search(
            string fam = null,
            string imya = null,
            string otchest = null,
            DateTime? datRozhdFrom = null,
            DateTime? datRozhdTo = null) {

            var citizensList = context.GetCitizens(
                fam,
                imya,
                otchest,
                datRozhdFrom,
                datRozhdTo
                );
            return Json(citizensList, JsonRequestBehavior.AllowGet);

        }

        [HttpDelete]
        [Route("Citizen/Delete")]
        public ActionResult Delete(int id)
        {
            var res = context.DeleteCitizen(id);
            return Json(res);
        }

        [HttpPost]
        [Route("Citizen/Post")]
        public ActionResult Post(
            string fam,
            string imya,
            string otchest,
            DateTime datrozhd)
        {
            var res = context.PostCitizen(new Models.Citizen()
            {
                Fam = fam,
                Imya = imya,
                Otchest = otchest,
                Dat_rozhd = datrozhd
            });

            return Json(res);
        }

        [HttpPut]
        public ActionResult Update(
            int id,
            string fam,
            string imya,
            string otchest,
            DateTime datrozhd)
        {
            var res = context.UpdateCitizen(id, new Models.Citizen()
            {
                Fam = fam,
                Imya = imya,
                Otchest = otchest,
                Dat_rozhd = datrozhd
            });

            return Json(res);
        }
    }
}