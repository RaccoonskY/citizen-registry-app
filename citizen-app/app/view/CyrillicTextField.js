Ext.define('CitizensApp.view.CyrillicTextField', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.cyrillictextfield',
    xtype: 'cyrillicfield',


    initComponent: function () {  
        this.callParent(arguments);

    },


    afterRender: function () {
        this.callParent(arguments);
        
        this.inputEl.on('keypress', this.cyrillicInputFilter, this);
        
    },


    cyrillicInputFilter: function (e) {
        var charCode = e.getCharCode();
        const symbolFromCode = String.fromCharCode(charCode);

        // Перевод из нижнего регистра в вверхний
        if (charCode >= 1072 && charCode <= 1103) { // Диапазон кириллических символов
            e.stopEvent(); // Предотвратить ввод символа
            charCode -= 32; // сделать toUpperCase() посредством вычета кода символа
            this.setRawValue(this.getRawValue() + String.fromCharCode(charCode));
        }
        else if ((charCode < 1040 || charCode > 1103) && charCode !== 32 && charCode !== 45) { // запретить все латинские символы кроме специальных
            e.stopEvent(); // Предотвратить ввод символа
            Ext.Msg.alert("Неподходящий символ","В поля данных возможно водить только заглавные символы кириллицы, тире и пробел!");
        }
        else if (charCode === 32 || charCode === 45){
            const curString = this.getRawValue();
            const lastChar = curString.slice(-1);
            
            if (curString.length == 0 || curString.includes(" ")){
                e.stopEvent();
                Ext.Msg.alert("Неподходящий символ","Пробелы и тире разрешается ставить только в середине.\n Возможен только 1 пробел.");
            }
            else if(lastChar == ' ' || lastChar == '-')
            {
                e.stopEvent();
            }
            else{
                e.stopEvent();
                var newString = (this.getRawValue() + symbolFromCode);
                this.setRawValue(newString);
            }


        }
    },
});
