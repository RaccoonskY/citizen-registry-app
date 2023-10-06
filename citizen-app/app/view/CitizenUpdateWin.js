Ext.define('CitizensApp.view.CitizenUpdateWin', {

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
            xtype: 'textfield',
            fieldLabel: 'Фамилия',
            name: 'fam',
            labelAlign: 'top',

        }, {
            xtype: 'textfield',
            fieldLabel: 'Имя',
            name: 'imya',
            labelAlign: 'top',
        }, {
            xtype: 'textfield',
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


    listeners: {
        close: async function (win) {
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

                const res = await fetch(
                    'https://localhost:44335/citizen/post',
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            },
                        body: JSON.stringify(newRecord)
                    }
                ).then(resp=>resp.json()).catch(error=>alert(`Не удалось добавить гражданина: ${error}`))
                    
                if(res){
                    var parentStore = Ext.getStore('citizenStore');
                    newRecord["dat_rozhd"] = newRecord.datrozhd;
                    newRecord["id"] = res;
                    delete newRecord["datrozhd"];
                    parentStore.add(newRecord);
                }

            }
            else{
                alert("Заполните все поля!");
            }     
        }
    },


    constructor: function(config){
        if(config.citizenToUpdate)
        config.listeners = {
            close: async function(win){
                
                var famFieldVal = win.down('[name=fam]').getValue();
                var imyaFieldVal = win.down('[name=imya]').getValue();
                var otchestFieldVal = win.down('[name=otchest]').getValue();
                var datRozhdFieldVal = win.down('[name=dat_rozhd]').getValue();

                var newRecord = {
                    id: config.citizenToUpdate.id,
                    fam: famFieldVal,
                    imya: imyaFieldVal,
                    otchest: otchestFieldVal,
                    datrozhd: datRozhdFieldVal
                };

                const res = await fetch(
                    'https://localhost:44335/citizen/update',
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            },

                        body: JSON.stringify(newRecord)
                    }
                ).then(resp=>resp.json()).catch(error=>alert(`Не удалось обновить гражданина гражданина: ${error}`))
                    
                if(res){
                    var parentStore = Ext.getStore('citizenStore');
                    var elemToUpdate = parentStore.getById(config.citizenToUpdate.id);   

                    elemToUpdate.set('fam', famFieldVal);
                    elemToUpdate.set('imya', imyaFieldVal);
                    elemToUpdate.set('otchest', otchestFieldVal);
                    elemToUpdate.set('dat_rozhd', datRozhdFieldVal);
    
                    elemToUpdate.commit();
                }
    
            }
        }
                
        this.callParent([config]);

        if (config.citizenToUpdate) {
            this.items.each(function (item) {
                if (item.name && config.citizenToUpdate[item.name] !== undefined) {
                    item.setValue(config.citizenToUpdate[item.name]);
                }
            });
        }
    }
});

