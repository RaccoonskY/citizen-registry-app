Ext.define('CitizensApp.view.CitizenUpdateWin', {


    requires:[
        'CitizensApp.view.CyrillicTextField'
    ],

    extend: 'Ext.window.Window',
    alias: 'widget.CitizenUpdateWin',
    xtype: 'citizen-update-win',

    title:'Введите данные гражданина',
    layout: {
        type: 'vbox',
        align: 'center'
    },

    modal: true,
    resizable: true,
    draggable: true,
    autoShow: true,
    closeAction: 'destroy',
    minWidth:200,
    minHeight:200,


    items:[{
            xtype: 'cyrillicfield',
            fieldLabel: 'Фамилия',
            name: 'fam',
            labelAlign: 'top',

        }, {
            xtype: 'cyrillicfield',
            fieldLabel: 'Имя',
            name: 'imya',
            labelAlign: 'top',
        }, {
            xtype: 'cyrillicfield',
            fieldLabel: 'Отчество',
            name:'otchest',
            labelAlign: 'top',
        }, {
            xtype: 'datefield',
            fieldLabel: 'Дата рождения',
            name:'dat_rozhd',
            labelAlign: 'top',
            format: 'd.m.Y'

        }

    ],

    
    compareDTOs: function(citizen1,citizen2){
        let objEqual = true;
        const keys = ["id", "imya", "fam", "otchest", "datrozhd"];
        try{
            keys.forEach(key => {
                if(citizen1[key].toString() != citizen2[key].toString()){
                    objEqual = false;
                }
            });
        } catch{
            return false;
        }
       
        return objEqual;
    },

    checkIdentical: function (citizenToUpdate, callback) {
        const checkDTO = citizenToUpdate;
        fetch("https://localhost:44335/citizen/getidenticals", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(checkDTO)
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

    addNewCitizen: async function(citizenToAdd){
        const res = await fetch(
            'https://localhost:44335/citizen/post',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    },
                body: JSON.stringify(citizenToAdd)
            }
        ).then(resp=>resp.json()).catch(error=>alert(`Не удалось добавить гражданина: ${error}`))
            
        if(res){
            var parentStore = Ext.getStore('citizenStore');
            citizenToAdd["dat_rozhd"] = citizenToAdd.datrozhd;
            citizenToAdd["id"] = res;
            delete citizenToAdd["datrozhd"];
            parentStore.add(citizenToAdd);
        }
    },

    updateCitizen: async function(citizenToUpdate){
        const res = await fetch(
            'https://localhost:44335/citizen/update',
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    },

                body: JSON.stringify(citizenToUpdate)
            }
        ).then(resp=>resp.json()).catch(error=>alert(`Не удалось обновить гражданина гражданина: ${error}`))
            
        if(res){
            var parentStore = Ext.getStore('citizenStore');
            var elemToUpdate = parentStore.getById(this.citizenToUpdate.id);   

            elemToUpdate.set('fam', citizenToUpdate.fam);
            elemToUpdate.set('imya', citizenToUpdate.imya);
            elemToUpdate.set('otchest', citizenToUpdate.otchest);
            elemToUpdate.set('dat_rozhd', citizenToUpdate.datrozhd);

            elemToUpdate.commit();
        }
    },

    getNewCitizenDTO: function(win){
        var famFieldVal = win.down('[name=fam]').getValue();
        var imyaFieldVal = win.down('[name=imya]').getValue();
        var otchestFieldVal = win.down('[name=otchest]').getValue();
        var datRozhdFieldVal = win.down('[name=dat_rozhd]').getValue();


        var newRecord = {
            fam: famFieldVal,
            imya: imyaFieldVal,
            otchest: otchestFieldVal,
            datrozhd: datRozhdFieldVal
        };

        return newRecord;
    },
    checkEmptyDTO: function(dto){
        return  dto['fam'] != "" && dto['imya'] != "" && dto['otchest'] != "" && dto["datrozhd"] != null ;
    },
    checkFilledDTO: function(dto){
        return  dto['fam'] != "" || dto['imya'] != "" || dto['otchest'] != "" || dto["datrozhd"] != null;
    },

    addNewHandler: function(window){
        let newRecord = this.getNewCitizenDTO(window);

    },

    updateHandler:   function(window){
        const oldRecord = this.citizenToUpdate;
        const updatedRecord = this.getNewCitizenDTO(window);
        updatedRecord["id"] = oldRecord.id;
        oldRecord["datrozhd"] = oldRecord.dat_rozhd;

        const areEqual = this.compareDTOs(oldRecord,updatedRecord);

        if(!areEqual ){
            let exiting = true;
            if(this.checkEmptyDTO(updatedRecord)){
                const updatingConfirm = confirm(`Вы точно хотите обновить гражданина ${oldRecord.fam} ${oldRecord.imya} ${oldRecord.otchest}?`)
                if(updatingConfirm){
                    this.checkIdentical(updatedRecord, function(identicals){
                        if(identicals > 0){
                            const identicalsConfirm = confirm(`Идетичные граждане уже существуют: ${identicals}.\nВы уверены, что хотите изменить?`);
                            if(identicalsConfirm){
                                window.updateCitizen(updatedRecord);
                                alert('Гражданин успешно изменен');
                            } else{
                                exitingConfirm = confirm("Вы хотите выйти?\nИзменения пропадут.");
                                if (exitingConfirm){
                                    exiting = true;
                                } 
                                else{
                                    Ext.widget("CitizenUpdateWin",{  
                                        citizenToUpdate: oldRecord,
                                        updating: true
                                    });
                                }
                            }
                        }
                        else{
                            window.updateCitizen(updatedRecord);
                            alert('Гражданин успешно изменен');
                        }
                    })
                    
                }
                else{
                    exitingConfirm = confirm("Вы хотите выйти?\nИзменения пропадут.");
                    if (!exitingConfirm){
                        return false;
                    }
                }
                if(!exiting) return false;

            } else{
                exitingConfirm = confirm("У вас есть незаполненные поля, изменения не произойдут, если вы выйдите. Выйти?");
                if (!exitingConfirm){
                    return false;
                }
            }
            
        }    
    },
   


    listeners: {
        beforeclose: function (window) {
            const updatedRecord = this.getNewCitizenDTO(window);
            if (window.checkEmptyDTO(updatedRecord)) {
                
                updatedRecord["dat_rozhd"] = updatedRecord.datrozhd;
                const updatingConfirm = confirm(`Вы точно хотите добавить гражданина ${updatedRecord.fam} ${updatedRecord.imya} ${updatedRecord.otchest}?`);
                if (updatingConfirm) {
                    this.checkIdentical(updatedRecord, function (identicals) {
                        if (identicals > 0) {
                            const identicalsConfirm = confirm(`Идентичные граждане уже существуют: ${identicals}.\nВы уверены, что хотите добавить?`);
                            if (identicalsConfirm) {
                                window.addNewCitizen(updatedRecord);
                                alert('Гражданин успешно добавлен');
                            }
                            else{
                                exitingConfirm = confirm("Вы хотите выйти?\nИзменения пропадут.");
                                if (exitingConfirm){
                                    return false;
                                } 
                                else{
                                    Ext.widget("CitizenUpdateWin",{  
                                        citizenToUpdate: updatedRecord,
                                    });
                                }
                            }
                        } else {
                            window.addNewCitizen(updatedRecord);
                            alert('Гражданин успешно добавлен');
                        }
                    });
                } else {
                    const exitingConfirm = confirm("Вы хотите выйти?\nИзменения пропадут.");
                    if (!exitingConfirm) {
                        return false;
                    }
                }
            } else if (window.checkFilledDTO(updatedRecord)) {
                const exitingConfirm = confirm("У вас есть незаполненные поля, изменения не произойдут, если вы выйдите. Выйти?");
                if (!exitingConfirm) {
                    return false;
                }
            }
        },
    },
    

    constructor:  function(config){
        if(config.citizenToUpdate && config.updating){
            config.listeners = {
                beforeclose: this.updateHandler
            }
                
        }    
        this.callParent([config]);
        this.initConfig(config);

        if (config.citizenToUpdate) {
            this.items.each(function (item) {
                if (item.name && config.citizenToUpdate[item.name] !== undefined) {
                    item.setValue(config.citizenToUpdate[item.name]);
                }
            });
        }
    }
});

