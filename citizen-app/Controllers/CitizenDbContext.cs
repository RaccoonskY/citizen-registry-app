using citizen_app.Models;
using IBM.Data.Informix;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.WebSockets;

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
                "Database = victordb_2;" +
                "CLIENT_LOCALE=ru_RU.CP1251;" +
                "DB_LOCALE=ru_RU.915")
        {
        }

        public List<Citizen> GetCitizens()
        {
            List<Citizen> citizens = new List<Citizen>();

            using (var conn = new IfxConnection(ConnectionString))
            using (var selectSQLCommand = new IfxCommand(
               "select * from citizen",
              conn
           ))
            {
                conn.Open();
                using (var dbReader = selectSQLCommand.ExecuteReader(CommandBehavior.Default))
                {

                    while (dbReader.Read())
                    {
                        citizens.Add(
                          new Citizen()
                          {
                              Citizen_id = dbReader.GetInt32(0),
                              Imya = dbReader.GetString(1),
                              Fam = dbReader.GetString(2),
                              Otchest = dbReader.GetString(3),
                              Dat_rozhd = dbReader.GetDateTime(4)
                          }
                      );

                    }
                    dbReader.Close();
                    return citizens;

                }                
            }
        }

        public Citizen GetCitizen(int id)
        {
            using (var conn = new IfxConnection(ConnectionString))
            using (var selectCom = new IfxCommand(
                    "select distinct * from citizen where citizen_id = ?",
                   conn
                ))
            {

                var idParam = new IfxParameter("id", IfxType.Integer)
                {
                    Value = id
                };

                Citizen citizenRes;
                try
                {
                    selectCom.Parameters.Add(idParam);
                    conn.Open();
                    using(var dbReader = selectCom.ExecuteReader(CommandBehavior.SingleRow))
                    {
                        if (!dbReader.HasRows)
                            return null;

                        dbReader.Read();
                        citizenRes = new Citizen()
                        {
                            Citizen_id = dbReader.GetInt32(0),
                            Imya = dbReader.GetString(1),
                            Fam = dbReader.GetString(2),
                            Otchest = dbReader.GetString(3),
                            Dat_rozhd = dbReader.GetDateTime(4)
                        };

                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }

                return citizenRes;
            }
        }

        public List<Citizen> GetCitizens(
            string imya = null, 
            string fam = null, 
            string otchest = null, 
            DateTime? datRozhdFrom = null, 
            DateTime? datRozhdTo = null)
        {
            List<Citizen> citizens = new List<Citizen>();
            var sqlCom = "select * from citizen";
            


            using (var conn = new IfxConnection(ConnectionString))
            using (var selectSQLCommand = BuildCommandSearchQuery(sqlCom, conn, fam, imya, otchest, datRozhdFrom, datRozhdTo))
            {
                conn.Open();
                using (var dbReader = selectSQLCommand.ExecuteReader(CommandBehavior.Default))
                {

                    while (dbReader.Read())
                    {
                        citizens.Add(
                          new Citizen()
                          {
                              Citizen_id = dbReader.GetInt32(0),
                              Imya = dbReader.GetString(1),
                              Fam = dbReader.GetString(2),
                              Otchest = dbReader.GetString(3),
                              Dat_rozhd = dbReader.GetDateTime(4)
                          }
                      );

                    }
                    dbReader.Close();
                    return citizens;

                }
            }
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

        //SHOULD BE REFACTORED
        private IfxCommand BuildCommandSearchQuery(
            string sql,
            IfxConnection conn,
            string fam = null,
            string imya = null,
            string otchest = null,
            DateTime? datRozhdFrom = null,
            DateTime? datRozhdTo = null)
        {
            var addingAND = false;

            var searchCom = new IfxCommand(sql, conn);

            if (fam != null)
            {
                var famParam = new IfxParameter("fam", IfxType.Char) { Value = fam};
                searchCom.CommandText += $" WHERE fam = ?";
                searchCom.Parameters.Add(famParam);
                addingAND = true ;
            }
            if (imya != null)
            {
                var imyaParam = new IfxParameter("imya", IfxType.Char) {Value = imya};
                searchCom.CommandText += addingAND ? " AND" : " WHERE";
                searchCom.CommandText += $" imya = ?";
                searchCom.Parameters.Add(imyaParam);
                addingAND = true;
            }
            if( otchest != null)
            {
                var otchestParam = new IfxParameter("otchest", IfxType.Char) { Value = otchest };
                searchCom.CommandText += addingAND ? " AND" : " WHERE";
                searchCom.CommandText += $" otchest = ?";
                searchCom.Parameters.Add(otchestParam);
                addingAND = true;
            }
            if (datRozhdFrom != null)
            {

                var datRozhdFromParam = new IfxParameter("dat_rozhd", IfxType.Date) { Value = $"{datRozhdFrom.Value:dd.mm.yyyy}"};
                searchCom.CommandText += addingAND ? " AND" : " WHERE";
                searchCom.CommandText += $" dat_rozhd >= ?";
                searchCom.Parameters.Add(datRozhdFromParam);
                addingAND = true;
            }
            if (datRozhdTo != null)
            {
                var datRozhdToParam = new IfxParameter("dat_rozhd", IfxType.Date) { Value = $"{datRozhdTo.Value:dd.mm.yyyy}" };
                searchCom.CommandText += addingAND ? " AND" : " WHERE";
                searchCom.CommandText += $" dat_rozhd <= ?";
                searchCom.Parameters.Add(datRozhdToParam);
            }

            return searchCom;

        }


    }
}