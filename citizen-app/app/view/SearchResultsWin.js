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


    constructor: function(config){
        
        var citizensStore = Ext.create("CitizensApp.store.Citizens");

        if (config.citizens) {
            
            config.citizens = config.citizens.map((elem) => ({
                id: elem.Citizen_id,
                fam: elem.Fam,
                imya: elem.Imya,
                otchest: elem.Otchest,
                dat_rozhd: `${elem.Dat_rozhd.slice(3,5)}.${elem.Dat_rozhd.slice(0,2)}.${elem.Dat_rozhd.slice(-4)}`
            }));
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
                        // Use Ext.Date.format to format the date in 'dd-mm-yyyy' format
                        return Ext.Date.format(value, 'd-m-Y');
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
                                let response = await fetch(config.url+`?offset=${config.offset}`,{
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                        },
                                    body: config.searchBody
                                }).
                                then(
                                    resp=>resp.json()
                                ).
                                catch(()=>{
                                    return [];
                                });
                                citizensToAdd = response;
                            }
                            else{
                                let response = await fetch(config.url+`?offset=${config.offset}`).
                                then(
                                    resp=>resp.json()
                                ).
                                catch(()=>{
                                    return [];
                                });
                                citizensToAdd = response;
                            }
            
                            citizensToAdd = citizensToAdd.map((elem) => ({
                                id: elem.Citizen_id,
                                fam: elem.Fam,
                                imya: elem.Imya,
                                otchest: elem.Otchest,
                                dat_rozhd: `${elem.Dat_rozhd.slice(3,5)}.${elem.Dat_rozhd.slice(0,2)}.${elem.Dat_rozhd.slice(-4)}`
                            }));
            
                            if(citizensToAdd != null && citizensToAdd.length > 0) {
                                store.loadData(citizensToAdd, append=true); 
                                config.offset += citizensToAdd.length;}
                            else{
                                alert("Данные для загрузки отсутствуют");
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
            
                            // console.log(selectedRecordData);
                            // alert('Вы собираетесь изменить ' + selectedRecords[0].get('fam'));
                            Ext.widget("CitizenUpdateWin",{  
                                citizenToUpdate: selectedRecordData,
                                updating: true
                            });
                            // удаление из таблицы
                            // store.removeAt(rowIndex);
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
                                        const url = "https://localhost:44335/citizen/delete?";
                                        res = await fetch(
                                            url+`id=${selectedRecords[0].get('id')}`,
                                            {
                                                method:"DELETE",
            
                                            }
                                        ).
                                        then(resp=>resp.json()).catch(res=>alert(`Не удалось удалить гражданина: ${res}`));   
            
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
