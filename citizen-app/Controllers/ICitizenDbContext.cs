using citizen_app.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace citizen_app.Controllers
{
    public interface ICitizenDbContext
    {
        /// <summary>
        /// Retrieves all citizens
        /// </summary>
        /// <returns></returns>
        List<Citizen> GetCitizens(int offset);

        /// <summary>
        /// Retrieves one citizen
        /// </summary>
        /// <param name="id">
        /// Id of citizen
        /// </param>
        /// <returns></returns>
        Citizen GetCitizen(int id);

        /// <summary>
        /// Retrvives all citizens according to the arguments
        /// </summary>
        /// <returns></returns>
        List<Citizen> GetCitizens(
            int offset = 0,
            string fam = null, 
            string imya = null, 
            string otchest = null, 
            DateTime? datRozhdFrom = null, 
            DateTime? datRozhdTo = null
            );

        
        /// <summary>
        /// Adds citizen to the database
        /// </summary>
        /// <param name="citizen"></param>
        /// <returns></returns>
        int PostCitizen(Citizen citizen);

        /// <summary>
        /// Updates citizen with <paramref name="id"/>
        /// </summary>
        /// <param name="id">
        /// Id of citizen to be updated
        /// </param>
        /// <param name="citizen">
        /// New citizen value to update
        /// </param>
        /// <returns></returns>
        bool UpdateCitizen(int id, Citizen citizen);

        /// <summary>
        /// Removes citizen from database with <paramref name="id"/>
        /// </summary>
        /// <param name="id">
        /// Id of citizen to be deleted
        /// </param>
        /// <returns></returns>
        bool DeleteCitizen(int id);

        int InitializeCitizens();



    }
}
