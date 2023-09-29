Ext.define('CitizensApp.view.SearchResultsWin', {
    requires:[
        "CitizensApp.store.Citizens",
        "CitizensApp.view.CitizenUpdateWin"
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

    items:[
        {
            xtype:"gridpanel",
            store: Ext.create("CitizensApp.store.Citizens"),
            columns: [
                { text: "ID", dataIndex: 'id'},
                { text: 'Имя',  dataIndex: 'imya' },
                { text: 'Фамилия',  dataIndex: 'fam' },
                { text: 'Отчество',  dataIndex: 'otchest', flex: 1 },
                { text: 'Дата рождения', dataIndex: 'dat_rozhd'}
            ],
            height: 200,
            width: 500,

            buttons:[
                {
                    text:"Добавить",
                    handler: function() {
                        Ext.widget("CitizenUpdateWin");
                    }
                },
                {
                    text: "Изменить",
                    handler: function () {
                        const grid = this.up('gridpanel');
                        const selectedRecords = grid.getSelectionModel().getSelection();
                        const selectedRecordData = selectedRecords[0].getData();

                        // console.log(selectedRecordData);
                        // alert('Вы собираетесь изменить ' + selectedRecords[0].get('fam'));
                        Ext.widget("CitizenUpdateWin",{  
                            citizenToUpdate: selectedRecordData 
                        });
                        // удаление из таблицы
                        // store.removeAt(rowIndex);
                    }
        
                },
                {
                    text:"Удалить",
                    handler: function() {
                        const grid = this.up('gridpanel');  
                        const selectedRecords = grid.getSelectionModel().getSelection();
                        const store = grid.getStore();
                        const rowIndexToDel = store.indexOf(selectedRecords[0]);
                        Ext.Msg.show({
                            title:'Удалить?',
                            msg: 'Вы точно хотите удалить?',
                            buttons:Ext.Msg.YES,
                            icon: Ext.Msg.QUESTION,
                            fn: ()=>{
                                store.removeAt(rowIndexToDel)
                            }
                       });

                    }
                },
                {
                    text: "Печать",
                    handler: function() {
                        this.up('window').close();
                    }
                }
            ]
        },
        
    ],

   

});
