Ext.define('CitizensApp.view.CitizenUpdateWinOLD', {


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

        }

    ],

    
    checkIdentical: async function(citizenToUpdate){
        const response = await fetch("https://localhost:44335/citizen/search" +`?offset=0`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify(citizenToUpdate)
        }). 
        then(
            resp=>resp.json()
        ).
        catch(er=>{
            return 0;
        });

        if (response != null){
            return response.length;
        }

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

            elemToUpdate.set('fam', famFieldVal);
            elemToUpdate.set('imya', imyaFieldVal);
            elemToUpdate.set('otchest', otchestFieldVal);
            elemToUpdate.set('dat_rozhd', datRozhdFieldVal);

            elemToUpdate.commit();
        }
    },

    addNewHandler: function(window){
        var famFieldVal = window.down('[name=fam]').getValue();
        var imyaFieldVal = window.down('[name=imya]').getValue();
        var otchestFieldVal = window.down('[name=otchest]').getValue();
        var datRozhdFieldVal = window.down('[name=dat_rozhd]').getValue();

        if (famFieldVal && imyaFieldVal && otchestFieldVal && datRozhdFieldVal){
            var newRecord = {
                fam: famFieldVal,
                imya: imyaFieldVal,
                otchest: otchestFieldVal,
                datrozhd: datRozhdFieldVal
            };
            Ext.Msg.confirm("Вы уверены?", "Вы уверены, что хотите добавить гражданина?", 
                async (answer) =>{
                    if (answer == "yes") {
                        const identicals = this.checkIdentical(newRecord);
                        if(identicals != 0){
                            Ext.Msg.confirm("Вы уверены?", "Идетичные граждане уже существуют. Вы уверены, что хотите добавить?", 
                            async (answer) => {
                                if (answer == "yes") {
                                    await this.addNewCitizen(newRecord);
                                    alert("Добавление успешно");
                                }
                                else{
                                    return 0;
                                }       
                            }); 
                        } else {
                            this.addNewCitizen(newRecord);
                            alert("Добавление успешно");
                        }
                        window.events.beforeclose.clearListeners();
                            window.close();
                    }
                }
            );    
        }
        else if (famFieldVal || imyaFieldVal || otchestFieldVal || datRozhdFieldVal){
            Ext.Msg.confirm("Вы уверены?", "Вы уверены, что хотите закрыть? Заполненные поля не сохранятся!", function(answer) {
                if (answer == "yes") {
                    window.events.beforeclose.clearListeners();
                    window.close();
                } else{
                    return false;
                }
            }); 
        }
    },


    updateHandler: async function(win, event){
        var famFieldVal = win.down('[name=fam]').getValue();
        var imyaFieldVal = win.down('[name=imya]').getValue();
        var otchestFieldVal = win.down('[name=otchest]').getValue();
        var datRozhdFieldVal = win.down('[name=dat_rozhd]').getValue();

        if (famFieldVal && imyaFieldVal && otchestFieldVal && datRozhdFieldVal){
            var newRecord = {
                fam: famFieldVal,
                imya: imyaFieldVal,
                otchest: otchestFieldVal,
                datrozhd: datRozhdFieldVal
            };
            Ext.Msg.confirm("Вы уверены?", "Вы уверены, что хотите изменить гражданина?", 
                async (answer) =>{
                    if (answer == "yes") {
                        const identicals = this.checkIdentical(newRecord);
                        if(identicals != 0){
                            Ext.Msg.confirm("Вы уверены?", "Идетичные граждане уже существуют. Вы уверены, что хотите изменить гражданина?", 
                            async (answer) => {
                                if (answer == "yes") {
                                    await this.updateCitizen(newRecord);
                                    alert("Изменение успешно");
                                }
                                else{
                                    return 0;
                                }       
                            }); 
                        } else {
                            this.updateCitizen(newRecord);
                            alert("Изменение успешно");
                        }
                        win.events.beforeclose.clearListeners();
                        win.close();
                    }
                }
            );    
        }
        else if (famFieldVal || imyaFieldVal || otchestFieldVal || datRozhdFieldVal){
            Ext.Msg.confirm("Вы уверены?", "Вы уверены, что хотите закрыть? Изменения не произойдут, введенные данные не сохранятся", 
              function(answer) {
                    if (answer == "yes") {
                        win.events.beforeclose.clearListeners();
                        win.close();
                    } 
                }
            ); 
            return false;
        }
    },
   


    listeners: {
        beforeclose: function(window) {
            this.addNewHandler(window);
        },
    },   



    constructor: function(config){
        if(config.citizenToUpdate && config.updating)
        config.listeners = {
            beforeclose: this.updateHandler
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

