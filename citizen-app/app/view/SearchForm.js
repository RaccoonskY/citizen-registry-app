
Ext.define('CitizensApp.view.SearchForm', {

    requires:[
        'CitizensApp.view.SearchResultsWin',
        'CitizensApp.view.CyrillicTextField'
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
            xtype: 'cyrillicfield',
            fieldLabel: 'Фамилия',
            name: 'fam',
            labelAlign: 'top',
            regex: /^[А-Яа-я\s-]*$/,
            regexText: 'Только заглавные символы кириллицы, - и пробел.'

        }, {
            xtype: 'cyrillicfield',
            fieldLabel: 'Имя',
            name: 'imya',
            labelAlign: 'top',
            regex: /^[А-Яа-я\s-]*$/,
            regexText: 'Только заглавные символы кириллицы, - и пробел.'
        }, {
            xtype: 'cyrillicfield',
            fieldLabel: 'Отчество',
            name:'otchest',
            labelAlign: 'top',
            regex: /^[А-Яа-я\s-]*$/,
            regexText: 'Только заглавные символы кириллицы, - и пробел.'
        }, {
            xtype: 'datefield',
            fieldLabel: 'Возраст с',
            name:'rozhd_ot',
            labelAlign: 'top',
            dateFormat: 'd-m-Y'

        },{
            xtype: 'datefield',
            fieldLabel: 'Возраст по',
            name:'rozhd_po',
            labelAlign: 'top',
            dateFormat: 'd-m-Y'
        },
        {
            xtype:'button',
            text: 'Поиск',
            align: 'center',

            handler: async ()=>{
                let url = 'https://localhost:44335/citizen/';
                let offset = 0;

                function formatDateToDDMMYYYY(date) {
                    if(!date){
                        return null
                    }
                    const dd = String(date.getDate()).padStart(2, '0');
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const yyyy = date.getFullYear();
                
                    return `${dd}.${mm}.${yyyy}`;
                }

                const datfrom = Ext.ComponentQuery.query('[name=rozhd_ot]')[0].getValue();
                const datto = Ext.ComponentQuery.query('[name=rozhd_po]')[0].getValue();

                var queries = {
                    fam: Ext.ComponentQuery.query('[name=fam]')[0].getValue(),
                    imya: Ext.ComponentQuery.query('[name=imya]')[0].getValue(),
                    otchest: Ext.ComponentQuery.query('[name=otchest]')[0].getValue(),
                    datrozhdfrom: formatDateToDDMMYYYY(datfrom),
                    datrozhdto: formatDateToDDMMYYYY(datto),
                }
                var res = [];
                
                let urlQueriesToResults = null;
                
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



                    const response = await fetch(url + 'search',{
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            },
                        body: JSON.stringify(urlQueries)
                    }).
                    then(
                        resp=>resp.json()
                    ).
                    catch(er=>{
                        alert("Такого гражданина нет");
                    });

                    urlQueriesToResults = JSON.stringify(urlQueries);
                    res = response;

                } else {
                    url+='getall';
                    const response = await fetch(url+`?offset=${offset}`).
                    then(
                        resp=>resp.json()
                    );
                    res = response;
                
                }
                
                offset += res.length < 40? res.length : 40; 


                /*
                res = [
                    {
                        "Citizen_id": 1,
                        "Fam": "Иванов".toUpperCase(),
                        "Imya": "Иван".toUpperCase(),
                        "Otchest": "Иванович".toUpperCase(),
                        "Dat_rozhd": "1988.01.11"
                    },
                    {
                        "Citizen_id": 3,
                        "Fam": "СЕРГЕЙ".toUpperCase(),
                        "Imya": "СРЕГЕЕВ".toUpperCase(),
                        "Otchest": "СЕРГЕЕВИЧ".toUpperCase(),
                        "Dat_rozhd": "1988.01.12"
                    },
                    {
                        "Citizen_id": 2,
                        "Fam": "Иванов".toUpperCase(),
                        "Imya": "Иван".toUpperCase(),
                        "Otchest": "Иванович".toUpperCase(),
                        "Dat_rozhd": "1968.01.11"
                    }
                ]
                */

                alert(`OFFSET:${offset} URL:${url}`);
                Ext.widget('SearchResultsWin',{
                    citizens: res,
                    offset: offset,
                    url:url,
                    searchBody: urlQueriesToResults
                }).show();
 
            }
        }

    ],

   


});

