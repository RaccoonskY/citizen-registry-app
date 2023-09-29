using IBM.Data.Informix;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;

namespace citizen_app.Controllers
{
    public class DbTestContext
    {

        string ConnectionString { get; set; }


        public DbTestContext(string connectionString)
        {
            ConnectionString = connectionString;


        }
        public DbTestContext() : this(
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

        // READ ALL
        // READER
        public List<Model.File> GetAllFiles()
        {
            List<Model.File> files = new List<Model.File>();
            using (var conn = new IfxConnection(ConnectionString))
            using (var selectCom = new IfxCommand(
               "select * from table1",
              conn
           ))
            {
                conn.Open();
                var dbReader = selectCom.ExecuteReader(CommandBehavior.Default);

                while (dbReader.Read())
                {
                    files.Add(
                      new Model.File()
                      {
                          id = dbReader.GetInt32(0),
                          myfile = dbReader.GetString(1)
                      }
                  );

                }
                dbReader.Close();
                return files;
            }

        }

        //READ ONE
        //READER 
        public Model.File GetFileById(int id)
        {
            using (var conn = new IfxConnection(ConnectionString))
            using (var selectCom = new IfxCommand(
                    "select distinct * from table1 where id = ?",
                   conn
                ))
            {

                var idParam = new IfxParameter("id", IfxType.Integer)
                {
                    Value = id
                };

                IfxDataReader dbReader = null;
                Model.File res;
                try
                {
                    selectCom.Parameters.Add(idParam);
                    conn.Open();

                    dbReader = selectCom.ExecuteReader(CommandBehavior.SingleRow);
                    if (!dbReader.HasRows)
                        return null;

                    dbReader.Read();
                    res = new Model.File()
                    {
                        id = dbReader.GetInt32(0),
                        myfile = dbReader.GetString(1)
                    };


                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    if (dbReader != null && !dbReader.IsClosed)
                    {
                        dbReader.Close();
                    }
                }

                return res;
            }
        }

        //CREATE FILE

        public bool PostFile(string myfile)
        {
            using (var conn = new IfxConnection(ConnectionString))
            using (var cmd = conn.CreateCommand())
            {
                var commandText = "INSERT INTO table1 VALUES(0, ?)";
                var myfileParam = new IfxParameter("myfile", IfxType.Char)
                {
                    Value = myfile
                };
                try
                {
                    conn.Open();
                    cmd.CommandText = commandText;
                    cmd.Parameters.Add(myfileParam);
                    cmd.ExecuteNonQuery();
                }
                catch
                {
                    return false;
                }
            }
            return true;
        }

        //UPDATE undone
        public bool UpdateFile(int id, string myfile)
        {
            using (var conn = new IfxConnection(ConnectionString))
            using (var cmd = conn.CreateCommand())
            {
                var commandText = "update table1 set myfile = ? where id = ?";
                var idParam = new IfxParameter("id", IfxType.Integer)
                {
                    Value = id
                };
                var myfileParam = new IfxParameter("myfile", IfxType.Char)
                {
                    Value = myfile
                };
                try
                {
                    conn.Open();
                    cmd.CommandText = commandText;
                    cmd.Parameters.Add(myfileParam);
                    cmd.Parameters.Add(idParam);
                    var res = cmd.ExecuteNonQuery();
                    if (res == 0) return false;
                }
                catch
                {
                    return false;
                }
            }
            return true;
        }


        //Delete 
        public bool DeleteFile(int id)
        {
            using (var conn = new IfxConnection(ConnectionString))
            using (var delCmd = new IfxCommand($"delete from table1 where id = {id}", conn))
            {
                try
                {
                    conn.Open();
                    delCmd.ExecuteNonQuery();
                }
                catch
                {
                    return false;
                }
            }
            return true;
        }

        ///
    }
}