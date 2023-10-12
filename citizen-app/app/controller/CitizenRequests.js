Ext.define('CitizensApp.controller.CitizenRequests',{

    statics:{   
        url: 'https://localhost:44335/citizen/',

        searchCitizens: async function(searchQuery, offset){
            const comQuery = 'search';
            try {
                const resp = await fetch(this.url + comQuery + `?offset=${offset}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(searchQuery)
                });
                return await resp.json();
            } catch (er) {
                return [];
            }
        },

        getAllCitizens: async function(offset){
            try {
                const resp = await fetch(this.url+"getall"+`?offset=${offset}`);
                return await resp.json();
            } catch (er) {
                console.log(er);
                return [];
            }
        },

        deleteCitizen: async function(selectedRecords){
            try{
                const resp = fetch(
                    this.url+"delete"+`?id=${selectedRecords[0].get('id')}`,
                    {
                        method:"DELETE",
                        referrerPolicy: "unsafe_url"
                    }
                )
                return await resp.json();
            } catch {
                Ext.Msg.alert('Неудачное удаление',`Не удалось удалить гражданина: ${resp}`);
                return false;
            }
        },

        getViewModels: function(citizens){
            return citizens.map((elem) => ({
                id: elem.Citizen_id,
                fam: elem.Fam,
                imya: elem.Imya,
                otchest: elem.Otchest,
                dat_rozhd: `${elem.Dat_rozhd.slice(3,5)}.${elem.Dat_rozhd.slice(0,2)}.${elem.Dat_rozhd.slice(-4)}`
            }));
        },

        checkIdentical: function (citizenToUpdate, callback) {
            fetch(this.url + "getidenticals", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(citizenToUpdate)
            })
            .then(response => response.json())
            .then(data => {
                const identicals = data ? data: 0;
                callback(identicals);
            })
            .catch(error => {
                callback(0);
            });
        },

        addCitizen: async function(citizenToAdd){
            try{
                const resp = await fetch(
                    this.url +'post',
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(citizenToAdd)
                    }
                );
                
                return await resp.json();
            } catch(error) {
                
                return false;
            }
        },

        updateCitizen: async function(citizenToUpdate){
            try{
                const resp = await fetch(
                    this.url + 'update',
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
        
                        body: JSON.stringify(citizenToUpdate)
                    }
                );

                return await resp.json();
            } catch(error){
                return false;
                ///Ext.Msg.alert('Неудача при изменении', `Не удалось обновить гражданина гражданина: ${error}` );
            }
        }



    },

    constructor: function(config) {
        this.initConfig(config);
    }

});