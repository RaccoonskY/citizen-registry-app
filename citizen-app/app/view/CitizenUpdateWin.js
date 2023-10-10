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
            regex: /^[А-Яа-я\s-]*$/,
            regexText: 'Только заглавные символы кириллицы, -, пробел.'

        }, {
            xtype: 'cyrillicfield',
            fieldLabel: 'Имя',
            name: 'imya',
            labelAlign: 'top',
            regex: /^[А-Яа-я\s-]*$/,
            regexText: 'Только заглавные символы кириллицы, -, пробел.'
        }, {
            xtype: 'cyrillicfield',
            fieldLabel: 'Отчество',
            name:'otchest',
            labelAlign: 'top',
            regex: /^[А-Яа-я\s-]*$/,
            regexText: 'Только заглавные символы кириллицы, -, пробел.'
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
            return true;
        }
        return false;
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
            var elemToUpdate = parentStore.getById(citizenToUpdate.id);   

            elemToUpdate.set('fam', citizenToUpdate.fam);
            elemToUpdate.set('imya', citizenToUpdate.imya);
            elemToUpdate.set('otchest', citizenToUpdate.otchest);
            elemToUpdate.set('dat_rozhd', citizenToUpdate.datrozhd);

            elemToUpdate.commit();
            return true
        }
        return false;
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
        return  dto['fam'] != "" && dto['imya'] != "" && dto["datrozhd"] != null ;
    },

    checkFilledDTO: function(dto){
        return  dto['fam'] != "" || dto['imya'] != "" || dto["datrozhd"] != null;
    },

    askForExit: function( message = "Вы хотите выйти?\nИзменения пропадут."){
        return Ext.Msg.show({
            title: 'Подтвердите выход.',
            msg: message,
            buttons: Ext.Msg.YESNO,
            buttonText:{
                yes:'Да',
                no:'Нет'
            },
            fn: (btn)=>{
                if(btn == 'yes'){
                    this.destroy();
                }
            }
        });
    },
    
    checkSuccess: function( res, message){
        if(res){
            Ext.Msg.alert('Удачно',message);
            this.destroy();
        } else{
            Ext.Msg.alert('Неудачно', 'Операция не завершилась удачно, проверьте правильность введенных данных');
        }
        
    },

    identicalRoute: function(updatedRecord, operationOnCitizen){
        const window = this;
        this.checkIdentical(updatedRecord, function (identicals) {
            if (identicals > 0) {
                Ext.Msg.show({
                    title: `Подтвердите добавление/изменение гражданина.`,
                    msg:`Идентичные граждане уже существуют: ${identicals}.\nВы уверены, что хотите добавить/изменить?`,
                    buttons: Ext.Msg.YESNO,
                    buttonText:{
                        yes:'Да',
                        no:'Нет'
                    },
                    fn: (btn) =>{
                        if (btn == 'yes') {
                            const res = operationOnCitizen(updatedRecord);
                            window.checkSuccess( res, 'Гражданин был успешно добавлен/изменён');
                        }
                        else{
                            window.askForExit();
                        }
                    }
                })
                
               
            } else {
                const res = operationOnCitizen(updatedRecord);
                window.checkSuccess(res, 'Гражданин был успешно добавлен');
            }
        });
       
    },

    updateHandler:   function(window){
        const oldRecord = this.citizenToUpdate;
        const updatedRecord = this.getNewCitizenDTO(window);
        updatedRecord["id"] = oldRecord.id;
        oldRecord["datrozhd"] = oldRecord.dat_rozhd;

        if(!this.compareDTOs(oldRecord,updatedRecord)){
            if (window.checkEmptyDTO(updatedRecord)) {
                
                updatedRecord["dat_rozhd"] = updatedRecord.datrozhd;
                Ext.Msg.show({
                    title: 'Подтвердите изменение гражданина.',
                    msg:`Вы точно хотите изменить: ${oldRecord.fam} ${oldRecord.imya} ${oldRecord.otchest}?`,
                    buttons: Ext.Msg.YESNO,
                    buttonText:{
                        yes:'Да',
                        no:'Нет'
                    },
                    minWidth:400,
                    fn: (btn)=>{
                        if(btn == 'yes'){
                            window.identicalRoute(updatedRecord, window.updateCitizen);
                        }
                        else{
                            window.askForExit();
                        }
                    }
                    
                })
            } else if (window.checkFilledDTO(updatedRecord)) {
                window.askForExit( 'Вы точно хотите выйти? Изменения пропадут.');
            } else{
                window.destroy();
            }      
            
            return false;  
        }    
    },
   


    listeners: {
        beforeclose: function (window) {
            const updatedRecord = this.getNewCitizenDTO(window);
            if (window.checkEmptyDTO(updatedRecord)) {
                
                updatedRecord["dat_rozhd"] = updatedRecord.datrozhd;
                Ext.Msg.show({
                    title: 'Подтвердите добавление гражданина.',
                    msg:`Вы точно хотите добавить: ${updatedRecord.fam} ${updatedRecord.imya} ${updatedRecord.otchest}?`,
                    buttons: Ext.Msg.YESNO,
                    buttonText:{
                        yes:'Да',
                        no:'Нет'
                    },
                    minWidth:400,
                    fn: (btn)=>{
                        if(btn == 'yes'){
                            window.identicalRoute(updatedRecord, window.addNewCitizen);
                        }
                        else{
                            window.askForExit();
                        }
                    }
                    
                })
            } else if (window.checkFilledDTO(updatedRecord)) {
                window.askForExit( 'Вы точно хотите выйти? Изменения пропадут.');
            } else{
                window.destroy();
            }
            return false;
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

