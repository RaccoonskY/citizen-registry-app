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
    public class CitizenDbContext: ICitizenDbContext
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

        //GET
        public List<Citizen> GetCitizens()
        {


            using (var conn = new IfxConnection(ConnectionString))
            using (var selectSQLCommand = new IfxCommand(
               "select * from citizen",
              conn
           ))
            {
                conn.Open();
                using (var dbReader = selectSQLCommand.ExecuteReader(CommandBehavior.Default))
                {
                    if (!dbReader.HasRows)
                        return null;
                    List<Citizen> citizens = new List<Citizen>();

                    while (dbReader.Read())
                    {
                        citizens.Add(
                          new Citizen()
                          {
                              Citizen_id = dbReader.GetInt32(0),
                              Fam = dbReader.GetString(1),
                              Imya = dbReader.GetString(2),
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

        //GET/ID
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


                try
                {
                    selectCom.Parameters.Add(idParam);
                    conn.Open();
                    using (var dbReader = selectCom.ExecuteReader(CommandBehavior.SingleRow))
                    {
                        if (!dbReader.HasRows)
                            return null;

                        dbReader.Read();
                        var citizenRes = new Citizen()
                        {
                            Citizen_id = dbReader.GetInt32(0),
                            Imya = dbReader.GetString(1),
                            Fam = dbReader.GetString(2),
                            Otchest = dbReader.GetString(3),
                            Dat_rozhd = dbReader.GetDateTime(4)
                        };

                        return citizenRes;

                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }

               
            }
        }

        //GET/PARAMS
        public List<Citizen> GetCitizens(
            string fam = null,
            string imya = null,
            string otchest = null,
            DateTime? datRozhdFrom = null,
            DateTime? datRozhdTo = null)
        {
            
            var sqlCom = "SELECT * FROM citizen";

            using (var conn = new IfxConnection(ConnectionString))
            using (var selectSQLCommand = BuildCommandSQ(sqlCom, conn, fam, imya, otchest, datRozhdFrom, datRozhdTo))
            {
                Console.WriteLine($"SQL COMMAND: {selectSQLCommand.CommandText}");
                conn.Open();
                using (var dbReader = selectSQLCommand.ExecuteReader(CommandBehavior.Default))
                {

                    if (!dbReader.HasRows)
                        return null;
                    List<Citizen> citizens = new List<Citizen>();

                    while (dbReader.Read())
                    {
                        citizens.Add(
                          new Citizen()
                          {
                              Citizen_id = dbReader.GetInt32(0),
                              Fam = dbReader.GetString(1),
                              Imya = dbReader.GetString(2),
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
            using (var conn = new IfxConnection(ConnectionString))
            using (var cmd = conn.CreateCommand())
            {
                var commandText = "INSERT INTO citizen VALUES(0, ?, ?, ?, ?)";
                var famParam = new IfxParameter("fam", IfxType.Char) { Value = citizen.Fam };
                var imyaParam = new IfxParameter("imya", IfxType.Char) { Value = citizen.Imya };
                var otchestParam = new IfxParameter("otchest", IfxType.Char) { Value = citizen.Otchest };
                var datRozhdParam = new IfxParameter("dat_rozhd", IfxType.Date) { Value = $"{citizen.Dat_rozhd:dd.MM.yyyy}" };
                try
                {
                    conn.Open();
                    cmd.CommandText = commandText;
                    cmd.Parameters.Add(famParam);
                    cmd.Parameters.Add(imyaParam);
                    cmd.Parameters.Add(otchestParam);
                    cmd.Parameters.Add(datRozhdParam);
                    cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("POST CITIZEN EXCEPTION OCCURED: " + ex.Message);
                    return false;
                }
            }
            return true;
        }

        public bool UpdateCitizen(int id, Citizen citizen)
        {
            using (var conn = new IfxConnection(ConnectionString))
            using (var cmd = conn.CreateCommand())
            {
                var commandText = "update citizen set fam = ?, imya = ?,otchest = ?, dat_rozhd = ?  where citizen_id = ?";
                var famParam = new IfxParameter("fam", IfxType.Char) { Value = citizen.Fam };
                var imyaParam = new IfxParameter("imya", IfxType.Char) { Value = citizen.Imya };
                var otchestParam = new IfxParameter("otchest", IfxType.Char) { Value = citizen.Otchest };
                var datRozhdParam = new IfxParameter("dat_rozhd", IfxType.Date) { Value = $"{citizen.Dat_rozhd:dd.MM.yyyy}" };
                var citizenIdParam = new IfxParameter("citizen_id", IfxType.Integer) { Value = id };
                try
                {
                    conn.Open();
                    cmd.CommandText = commandText;
                    cmd.Parameters.Add(famParam);
                    cmd.Parameters.Add(imyaParam);
                    cmd.Parameters.Add(otchestParam);
                    cmd.Parameters.Add(datRozhdParam);
                    cmd.Parameters.Add(citizenIdParam);
                    var res = cmd.ExecuteNonQuery();
                    if (res == 0) return false;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("UPDATE CITIZEN EXCEPTION OCCURED: " + ex.Message);
                    return false;
                }
            }
            return true;
        }

        public bool DeleteCitizen(int id)
        {
            using (var conn = new IfxConnection(ConnectionString))
            using (var delCmd = new IfxCommand($"delete from citizen where citizen_id = {id}", conn))
            {
                try
                {
                    conn.Open();
                    delCmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("DELETE CITIZEN EXCEPTION OCCURED: " + ex.Message);
                    return false;
                }
            }
            return true;
        }

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //SHOULD BE REFACTORED
        //CHANGING ifxCommand must be in separated function
        private IfxCommand BuildCommandSQ(
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
                var famParam = new IfxParameter("fam", IfxType.Char) { Value = fam };
                searchCom.CommandText += $" WHERE fam = ?";
                searchCom.Parameters.Add(famParam);
                addingAND = true;
            }
            if (imya != null)
            {
                var imyaParam = new IfxParameter("imya", IfxType.Char) { Value = imya };
                searchCom.CommandText += addingAND ? " AND" : " WHERE";
                searchCom.CommandText += $" imya = ?";
                searchCom.Parameters.Add(imyaParam);
                addingAND = true;
            }
            if (otchest != null)
            {
                var otchestParam = new IfxParameter("otchest", IfxType.Char) { Value = otchest };
                searchCom.CommandText += addingAND ? " AND" : " WHERE";
                searchCom.CommandText += $" otchest = ?";
                searchCom.Parameters.Add(otchestParam);
                addingAND = true;
            }
            if (datRozhdFrom != null)
            {

                var datRozhdFromParam = new IfxParameter("dat_rozhd", IfxType.Date) { Value = $"{datRozhdFrom.Value:dd.MM.yyyy}" };
                searchCom.CommandText += addingAND ? " AND" : " WHERE";
                searchCom.CommandText += $" dat_rozhd >= ?";
                searchCom.Parameters.Add(datRozhdFromParam);
                addingAND = true;
            }
            if (datRozhdTo != null)
            {
                var datRozhdToParam = new IfxParameter("dat_rozhd", IfxType.Date) { Value = $"{datRozhdTo.Value:dd.MM.yyyy}" };
                searchCom.CommandText += addingAND ? " AND" : " WHERE";
                searchCom.CommandText += $" dat_rozhd <= ?";
                searchCom.Parameters.Add(datRozhdToParam);
            }

            return searchCom;

        }


    }
}