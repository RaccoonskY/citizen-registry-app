
Ext.define('CitizensApp.view.SearchForm', {

    requires:[
        'CitizensApp.view.SearchResultsWin',
        'CitizensApp.view.CyrillicTextFieldSearch',
        'CitizensApp.controller.CitizenRequests'
    ],
    extend: 'Ext.form.Panel',
    alias: 'widget.SearchForm',
    xtype: 'citizen-search-form',

    title:'Данные граждан',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    
    items:[{
            xtype: 'cyrillicfieldsearch',
            fieldLabel: 'Фамилия',
            name: 'fam',
            labelAlign: 'top',
            regex: /^[А-Яа-я\s-*?\[\]^\\]*$/,
            regexText: 'Только заглавные символы кириллицы, -, пробел и []*\\^?.'

        }, {
            xtype: 'cyrillicfieldsearch',
            fieldLabel: 'Имя',
            name: 'imya',
            labelAlign: 'top',
            regex: /^[А-Яа-я\s-*?\[\]^\\]*$/,
            regexText: 'Только заглавные символы кириллицы, -, пробел и []*\\^?.'
        }, {
            xtype: 'cyrillicfieldsearch',
            fieldLabel: 'Отчество',
            name:'otchest',
            labelAlign: 'top',
            regex: /^[А-Яа-я\s-*?\[\]^\\]*$/,
            regexText: 'Только заглавные символы кириллицы, -, пробел и []*\\^?.'
        }, {
            xtype: 'datefield',
            fieldLabel: 'Возраст с',
            name:'rozhd_ot',
            labelAlign: 'top',
            format: 'd.m.Y',
            maxValue: new Date()

        },{
            xtype: 'datefield',
            fieldLabel: 'Возраст по',
            name:'rozhd_po',
            labelAlign: 'top',
            format: 'd.m.Y',
            maxValue: new Date()
        },
        {
            xtype:'button',
            text: 'Поиск',
            align: 'center',

            formatDateToDDMMYYYY: function (date) {
                if(!date){
                    return null
                }
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();
            
                return `${dd}.${mm}.${yyyy}`;
            },

            handler: async function(){
                citizensRequests = CitizensApp.controller.CitizenRequests;
                let offset = 0;

                const datfrom = Ext.ComponentQuery.query('[name=rozhd_ot]')[0].getValue();
                const datto = Ext.ComponentQuery.query('[name=rozhd_po]')[0].getValue();

                var queries = {
                    fam: Ext.ComponentQuery.query('[name=fam]')[0].getValue(),
                    imya: Ext.ComponentQuery.query('[name=imya]')[0].getValue(),
                    otchest: Ext.ComponentQuery.query('[name=otchest]')[0].getValue(),
                    datrozhdfrom: this.formatDateToDDMMYYYY(datfrom),
                    datrozhdto: this.formatDateToDDMMYYYY(datto),
                }
                var res = [];
                
                let urlQueriesToResults = null;
                let urlToPass = citizensRequests.url;
                /*
                if (
                    queries.fam
                    ||queries.imya
                    ||queries.otchest
                    ||queries.datrozhdfrom
                    ||queries.datrozhdto){
                    
                    const urlQueries = {
                    };        

                    for (const key in queries) {
                        if (Object.hasOwnProperty.call(queries, key)) {
                            const element = queries[key];
                            if(element != null && element != "") {  
                                urlQueries[key] = element;
                            }      
                        }
                    }
                    
                    const response = await citizensRequests.searchCitizens(urlQueries, offset);

                    urlQueriesToResults = JSON.stringify(urlQueries);
                    res = response;
                    urlToPass+='search';
                } else {
                    const response = await citizensRequests.getAllCitizens(offset);
                    res = response;
                    urlToPass+='getall';
                
                }
                */
                res = [{
                    Citizen_id: 0,
                    Fam:"ИВАН",
                    Imya:"ИВАН",
                    Otchest:"ИВАН",
                    Dat_rozhd: "19.10.1984"
                }]
                offset += res.length < 40? res.length : 40; 

               
                Ext.widget('SearchResultsWin',{
                    citizens: res,
                    offset: offset,
                    url: urlToPass,
                    empty: res.length == 0,
                    searchBody: urlQueriesToResults
                }).show();
 
            }
        }

    ],

});

