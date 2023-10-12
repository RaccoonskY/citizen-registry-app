using citizen_app.Models;
using FastReport.Export.Pdf;
using FastReport;
using FastReport.Web;
using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using System.Data;
using System.IO;
using System.Drawing;
using FastReport.Data;

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
        [HttpPut]
        public ActionResult GeneratePdfReport(List<Citizen> citizens)
        {

            Report report = new Report();

            report.Load(Server.MapPath("../CitizensReportv1.frx"));

            report.RegisterData(citizens, "Citizens");

            PDFExport pdfExport = new PDFExport();
            report.Prepare();

            System.IO.MemoryStream stream = new System.IO.MemoryStream();

            report.Export(pdfExport, stream);

            string fileName = "CitizenReport.pdf";

            return File(stream.ToArray(), "application/pdf", fileName);
        }
        private List<Citizen> GetCitizens()
        {
            List<Citizen> citizens = new List<Citizen>
            {
                new Citizen {Citizen_id=1, Fam = "Иван", Imya = "Петров", Otchest = "Иванович", Dat_rozhd="19.11.2004" },
                new Citizen { Citizen_id=2,Fam = "Мария", Imya = "Иванова", Otchest = "Иванович", Dat_rozhd="19.11.2004" },
                new Citizen { Citizen_id=2,Fam = "Мария", Imya = "Иванова", Otchest = "Иванович", Dat_rozhd="19.11.2004" },
                // Добавьте остальных граждан
            };
            return citizens;
        }
        [HttpGet]
        public ActionResult GetAll(int offset = 0)
        {
            var citizensList = context.GetCitizens(offset);
            return Json(citizensList, JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public ActionResult Get(int id)
        {
            var citizen = context.GetCitizen(id);
            return Json(citizen, JsonRequestBehavior.AllowGet);

        }

        [HttpPut]
        [Route("Citizen/Search")]
        public ActionResult Search(
            int offset = 0,
            string fam = null,
            string imya = null,
            string otchest = null,
            DateTime? datrozhdfrom = null,
            DateTime? datrozhdto = null) {

            var citizensList = context.GetCitizens(
                offset,
                fam,
                imya,
                otchest,
                datrozhdfrom,
                datrozhdto
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
                Dat_rozhd = $"{datrozhd:dd.MM.yyyy}"
            });

            return Json(res);
        }
        [HttpPut]
        [Route("Citizen/Identicals")]
        public ActionResult GetIdenticals(
            string fam,
            string imya,
            string otchest,
            DateTime datrozhd)
        {
            var res = context.GetIdenticalsNumber(new Models.Citizen()
            {
                Fam = fam,
                Imya = imya,
                Otchest = otchest,
                Dat_rozhd = $"{datrozhd:dd.MM.yyyy}"
            });

            return Json(res);
        }


        [HttpPost]
        [Route("Citizen/Init")]
        public ActionResult Init()
        {
            var res = context.InitializeCitizens();

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
                Dat_rozhd = $"{datrozhd:dd.MM.yyyy}"
            });

            return Json(res);
        }

        [HttpGet]
        [Route("Citizen/Report")]
        public ActionResult GetReport(List<Models.Citizen> citizensToReport)
        {
            WebReport report = new WebReport();
            return View();
        }
    }
}