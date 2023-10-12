Ext.define('CitizensApp.controller.CitizenRequests',{

    statics:{   
        url: 'https://localhost:44335/citizen/',

        searchCitizens: async function(searchQuery, offset){
            const comQuery = 'search';
            const waitWindow = Ext.Msg.wait('Пожалуйства, подождите', 'Происходит загрузка данных...');
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
            } finally{
                waitWindow.close();
            }
            
        },

        getAllCitizens: async function(offset){
            
            const waitWindow = Ext.Msg.wait('Пожалуйства, подождите', 'Происходит загрузка данных...');
            try {
                const resp = await fetch(this.url+"getall"+`?offset=${offset}`);
                return await resp.json();
            } catch (er) {
                console.log(er);
                return [];
            } finally {
                waitWindow.close();
            }
        },

        deleteCitizen: async function(selectedRecords){
            
            const waitWindow = Ext.Msg.wait('Пожалуйства, подождите', 'Происходит операция...');
            try{
                const resp = await fetch(
                    this.url+"delete"+`?id=${selectedRecords[0].get('id')}`,
                    {
                        method:"DELETE",
                    }
                );
                return await resp.json();
            } catch (error){
                console.log(error);
                Ext.Msg.alert('Неудачное удаление',`Не удалось удалить гражданина`);
                return false;
            } finally {
                waitWindow.close();
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
            
            const waitWindow = Ext.Msg.wait('Пожалуйства, подождите', 'Происходит операция...');
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
            } finally {
                waitWindow.close();
            }
        },

        updateCitizen: async function(citizenToUpdate){
            
            const waitWindow = Ext.Msg.wait('Пожалуйства, подождите', 'Происходит операция...');
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
            } finally {
                waitWindow.close();
            }
        },

        sendCitizensReport: async function(citizens){
            
            const waitWindow = Ext.Msg.wait('Пожалуйства, подождите', 'Происходит операция...');
            try{
                const resp = await fetch(
                    this.url + 'GeneratePdfReport',
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                      
                        body: JSON.stringify(citizens)
                    }
                );

                if (resp.ok) {
                    const blob = await resp.blob();
        
                    const blobUrl = URL.createObjectURL(blob);
        
                    const downloadLink = document.createElement('a');
                    downloadLink.href = blobUrl;
                    downloadLink.download = 'report.pdf';
                    downloadLink.style.display = 'none';
        
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
        
                    URL.revokeObjectURL(blobUrl);
        
                    return true;
                } else {
                    console.error('Server response was not ok');
                    return false;
                }
            }
            catch(error){
                console.error('Error while fetching PDF report:', error);
                return false;
            } finally {
                waitWindow.close();
            }

        }
    },

    constructor: function(config) {
        this.initConfig(config);
    }

});