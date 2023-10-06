import function getAll(){
    Ext.Ajax.request({
    url: 'https://localhost:44335/citizen/getall',
    success: function(response, options){
        const res = [];
        const allCitizens = Ext.decode(response.responseText)
        allCitizens.forEach(element => {
            res.push(element)
        });
        
        return res;
    },
    failure: function(response, options){
        alert("Ошибка: " + response.statusText);
    }
});}