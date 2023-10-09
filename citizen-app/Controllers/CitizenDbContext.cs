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
        public List<Citizen> GetCitizens(int offset)
        {
            using (var conn = new IfxConnection(ConnectionString))
            using (var selectSQLCommand = new IfxCommand(
               $"SELECT SKIP {offset} FIRST 40 * FROM citizen;",
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
                              Fam = dbReader.GetString(1).TrimEnd(' '),
                              Imya = dbReader.GetString(2).TrimEnd(' '),
                              Otchest = dbReader.GetString(3).TrimEnd(' '),
                              Dat_rozhd = $"{dbReader.GetDateTime(4):dd.MM.yyyy}"
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
                            Imya = dbReader.GetString(1).TrimEnd(' '),
                            Fam = dbReader.GetString(2).TrimEnd(' '),
                            Otchest = dbReader.GetString(3).TrimEnd(' '),
                            Dat_rozhd = $"{dbReader.GetDateTime(4):dd.MM.yyyy}"
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
            int offset,
            string fam = null,
            string imya = null,
            string otchest = null,
            DateTime? datrozhdfrom = null,
            DateTime? datrozhdto = null)
        {
            
            var sqlCom = $"SELECT SKIP {offset} FIRST 40 * FROM citizen";

            using (var conn = new IfxConnection(ConnectionString))
            using (var selectSQLCommand = BuildCommandSQ(sqlCom, conn, fam, imya, otchest, datrozhdfrom, datrozhdto))
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
                              Fam = dbReader.GetString(1).TrimEnd(' '),
                              Imya = dbReader.GetString(2).TrimEnd(' '),
                              Otchest = dbReader.GetString(3).TrimEnd(' '),
                              Dat_rozhd = $"{dbReader.GetDateTime(4):dd.MM.yyyy}"
                          }
                      );

                    }
                    dbReader.Close();
                    return citizens;

                }
            }
        }

        public int GetIdenticalsNumber(Citizen citizen)
        {
            var sqlCom = $"SELECT COUNT(*) FROM citizen WHERE fam = ? AND imya = ? AND otchest = ? AND dat_rozhd = ?";
            var famParam = new IfxParameter("fam", IfxType.Char) { Value = citizen.Fam };
            var imyaParam = new IfxParameter("imya", IfxType.Char) { Value = citizen.Imya };
            var otchestParam = new IfxParameter("otchest", IfxType.Char) { Value = citizen.Otchest };
            var datRozhdParam = new IfxParameter("dat_rozhd", IfxType.Date) { Value = $"{citizen.Dat_rozhd:dd.MM.yyyy}" };
            using (var conn = new IfxConnection(ConnectionString))
            using (var cmd = new IfxCommand(sqlCom, conn))
            {
                conn.Open();
                cmd.Parameters.Add(famParam);
                cmd.Parameters.Add(imyaParam);
                cmd.Parameters.Add(otchestParam);
                cmd.Parameters.Add(datRozhdParam);
                using (var dbReader = cmd.ExecuteReader(CommandBehavior.Default))
                {

                    if (!dbReader.HasRows)
                        return 0;

                    dbReader.Read();
                    var count = dbReader.GetString(0);
                    dbReader.Close();
                    return int.Parse(count);

                }
            }
        }

        public int PostCitizen(Citizen citizen)
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

                    cmd.CommandText = "SELECT DBINFO('sqlca.sqlerrd1') AS last_serial FROM citizen";
                    cmd.Parameters.Clear();
                    using (var dbReader = cmd.ExecuteReader(CommandBehavior.Default))
                    {
                        if (!dbReader.HasRows)
                            return -1;
                        dbReader.Read();
                        var new_id = dbReader.GetInt32(0);
                        return new_id;
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine("POST CITIZEN EXCEPTION OCCURED: " + ex.Message);
                    return -1;
                }
                return -1;
            }

            
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

                var famParam = new IfxParameter("fam", IfxType.Char) { Value = $"{fam}" };
                searchCom.CommandText += $" WHERE fam MATCHES ?";
                searchCom.Parameters.Add(famParam);
                addingAND = true;
            }
            if (imya != null)
            {
                var imyaParam = new IfxParameter("imya", IfxType.Char) { Value = $"{imya}" };
                searchCom.CommandText += addingAND ? " AND" : " WHERE";
                searchCom.CommandText += $" imya MATCHES ?";
                searchCom.Parameters.Add(imyaParam);
                addingAND = true;
            }
            if (otchest != null)
            {
                var otchestParam = new IfxParameter("otchest", IfxType.Char) { Value = $"{otchest}" };
                searchCom.CommandText += addingAND ? " AND" : " WHERE";
                searchCom.CommandText += $" otchest MATCHES ?";
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

        public int InitializeCitizens()
        {
            using (var conn = new IfxConnection(ConnectionString))
            using (var cmd = conn.CreateCommand())
            {
                var citizensToAdd = 45;
                var names = new string[] { "СЕРГЕЙ", "ИВАН", "МИХАИЛ", "ВИКТОР", "ОЛЕГ","АРСЕНИЙ" };
                var surnames = new string[] { "ИВАНОВ", "СЕРГЕЕВ", "МИХАЙЛОВ", "ВИКТОРОВ", "ОЛЕГОВ" };
                var secondNames = new string[] { "ИВАНОВИЧ", "СЕРГЕЕВИЧ", "МИХАЙЛОВИЧ", "ВИКТОРОВИЧ", "ОЛЕГОВИЧ", "АРСЕНЬЕВИЧ" };

                Random random = new Random();
                cmd.CommandText = "INSERT INTO citizen VALUES(0, ?, ?, ?, ?)";

                for (int i = 0; i < citizensToAdd; i++)
                {
                    var famParam = new IfxParameter("fam", IfxType.Char) 
                        { Value =  surnames[random.Next(0,surnames.Length)]};
                    var imyaParam = new IfxParameter("imya", IfxType.Char) 
                        { Value = names[random.Next(0,names.Length)]};
                    var otchestParam = new IfxParameter("otchest", IfxType.Char) 
                        { Value = secondNames[random.Next(0, secondNames.Length)] };
                    var datRozhdParam = new IfxParameter("dat_rozhd", IfxType.Date) 
                        {
                            Value = 
                            $"{random.Next(0,30)}" +
                            $".0{random.Next(1,9)}" +
                            $".{random.Next(1950,2020)}"
                        };

                    cmd.Parameters.Add(famParam);
                    cmd.Parameters.Add(imyaParam);
                    cmd.Parameters.Add(otchestParam);
                    cmd.Parameters.Add(datRozhdParam);
                    try
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        cmd.Parameters.Clear();
                        conn.Close();

                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("POST CITIZEN EXCEPTION OCCURED: " + ex.Message);
                        return -1;
                    }
                }
                return 0;
            }


        }

    }
}