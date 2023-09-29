using citizen_app.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;

namespace citizen_app.Controllers
{
    public class CitizenDbContext :ICitizenDbContext
    {
        string ConnectionString { get; set; }


        public CitizenDbContext(string connectionString)
        {
            ConnectionString = connectionString;


        }
        public CitizenDbContext() : this(
                "Host=192.168.224.27; " +
                "Service=1527;" +
                "Server = ol_test; " +
                "User ID = informix; " +
                "password = info;" +
                "Database = victordb2;" +
                "CLIENT_LOCALE=ru_RU.CP1251;" +
                "DB_LOCALE=ru_RU.915")
        {
        }

        public List<Citizen> GetCitizens()
        {
            throw new NotImplementedException();
        }

        public Citizen GetCitizen(int id)
        {
            throw new NotImplementedException();
        }

        public Citizen GetCitizens(string imya = null, string fam = null, string otchest = null, DateTime? datRozhdFrom = null, DateTime? datRozhdTo = null)
        {
            throw new NotImplementedException();
        }

        public bool PostCitizen(Citizen citizen)
        {
            throw new NotImplementedException();
        }

        public bool UpdateCitizen(string id, Citizen citizen)
        {
            throw new NotImplementedException();
        }

        public bool DeleteCitizen(string id)
        {
            throw new NotImplementedException();
        }
    }
}