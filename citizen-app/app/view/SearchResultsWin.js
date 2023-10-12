Ext.define('CitizensApp.view.SearchResultsWin', {
    requires:[
        "CitizensApp.store.Citizens",
        "CitizensApp.view.CitizenUpdateWin",
        'CitizensApp.controller.CitizenRequests'
    ],
    extend: 'Ext.window.Window',
    alias: 'widget.SearchResultsWin',
    xtype: 'citizen-search-results',

    title:'Граждане',
  
    modal: true,
    resizable: true,
    draggable: true,
    autoShow: true,
    closeAction: 'destroy',
    
    layout:'fit',


    constructor: function(config){
        const citizenRequests = CitizensApp.controller.CitizenRequests;
        var citizensStore = Ext.create("CitizensApp.store.Citizens");

        if (config.citizens) {
            
            config.citizens = citizenRequests.getViewModels(config.citizens);
            citizensStore.loadData(config.citizens);

            
        }

        const grid = Ext.create('Ext.grid.Panel', {
            store: citizensStore,
            columns: [
                { text: 'Фамилия', dataIndex: 'fam',flex: 1  },
                { text: 'Имя', dataIndex: 'imya', flex: 1 },
                { text: 'Отчество', dataIndex: 'otchest', flex: 1 },
                {
                    text: 'Дата рождения',
                    dataIndex: 'dat_rozhd',
                    renderer: function (value) {
                        return Ext.Date.format(value, 'd.m.Y');
                    },
                    flex: 1 
                }
            ],
            height: 500,
            width: 1000,
            dockedItems:
            {
                xtype: 'toolbar',
                dock: 'bottom',
                items:[
                    {
                        text:"Загрузить еще",
                        itemId:"loadBtn",
                        handler: async function(){
                            const store = grid.getStore();
                            let citizensToAdd = null;

                            if(config.searchBody != null){
                                const response = await citizenRequests.searchCitizen(config.searchBody,config.offset);
                                citizensToAdd = response;
                            }
                            else{
                                let response = await citizenRequests.getAllCitizens(config.offset);
                                citizensToAdd = response;
                            }
            
                            citizensToAdd = citizenRequests.getViewModels(citizensToAdd);
            
                            if(citizensToAdd != null && citizensToAdd.length > 0) {
                                store.loadData(citizensToAdd, append=true); 
                                config.offset += citizensToAdd.length;}
                            else{
                                Ext.Msg.alert('Загрузка данных прервана',"Данные для загрузки отсутствуют");
                            }
                            
                        }
                    },
                    {
                        text:"Добавить",
                        itemId:"addfBtn",
                        handler: function() {
                            Ext.widget("CitizenUpdateWin");
                        }
                    },
                    {
                        text: "Изменить",
                        itemId:"changeBtn",
                        handler: function () {
                            const grid = this.up('gridpanel');
                            const selectedRecords = grid.getSelectionModel().getSelection();
                            const selectedRecordData = selectedRecords[0].getData();

                            Ext.widget("CitizenUpdateWin",{  
                                citizenToUpdate: selectedRecordData,
                                updating: true
                            });

                        }
            
                    },
                    {
                        text:"Удалить",
                        itemId:"delBtn",
                        handler: function() {
            
                            const grid = this.up('gridpanel');  
                            const selectedRecords = grid.getSelectionModel().getSelection();
                            const store = grid.getStore();
                            const rowIndexToDel = store.indexOf(selectedRecords[0]);
            
                            Ext.Msg.show({
                                title:'Удалить?',
                                msg: `Вы точно хотите удалить\n ${selectedRecords[0].get('fam')} ${selectedRecords[0].get('imya')} ${selectedRecords[0].get('otchest')}?`,
                                buttons:Ext.Msg.YES,
                                icon: Ext.Msg.QUESTION,
                                fn: async (btn)=>{
                                    if(btn == 'yes'){
                                        res = await citizenRequests.deleteCitizen(selectedRecords);
                                        if(res){
                                            store.removeAt(rowIndexToDel);
                                        }
                                    }
                                   
                                }
                           });
            
                        }
                    },
                    {
                        text: "Печать",
                        itemId:"printBtn",
                        handler: function() {
                            this.up('window').close();
                        }
                    }
                ]
            } 
        });

        grid.on('afterrender', function () {
            const toolbar = grid.getDockedItems('toolbar[dock="bottom"]')[0];

            const loadBtn = toolbar.getComponent('loadBtn');
            const changeBtn = toolbar.getComponent('changeBtn');
            const delBtn = toolbar.getComponent('delBtn');
            const printBtn = toolbar.getComponent('printBtn');

            const isEmpty = true;
            loadBtn.setDisabled(false);
            printBtn.setDisabled(false);
            changeBtn.setDisabled(isEmpty);
            delBtn.setDisabled(isEmpty);
        });

        grid.on('selectionchange', function () {
            const toolbar = grid.getDockedItems('toolbar[dock="bottom"]')[0];
            
            const loadBtn = toolbar.getComponent('loadBtn');
            const changeBtn = toolbar.getComponent('changeBtn');
            const delBtn = toolbar.getComponent('delBtn');
            const printBtn = toolbar.getComponent('printBtn');
            
            const selectedRecords = grid.getSelectionModel().getSelection();
            const isEmpty = selectedRecords.length === 0;
            
            loadBtn.setDisabled(isEmpty);
            changeBtn.setDisabled(isEmpty);
            delBtn.setDisabled(isEmpty);
            printBtn.setDisabled(isEmpty);
        });

        config.items = [grid];
        this.callParent([config]);
        
    },
});
