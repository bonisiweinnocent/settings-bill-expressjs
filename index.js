const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser =require('body-parser')
const SettingsBill = require('./settings-bill');
const app = express();
const settingsBill = SettingsBill();
const moment =require('moment')
moment().format();




app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.engine('handlebars', exphbs({defaultLayout: 'main',layoutsDir: __dirname+'/views/layouts'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    let addClass = "";
    if(settingsBill.hasReachedWarningLevel()){
        addClass = "warning"
    }
    if(settingsBill.hasReachedCriticalLevel()){
        addClass = "danger"
    }
    if(settingsBill.totals().grandTotal < settingsBill.getSettings().criticalLevel){
        
    }
    res.render('index',{
        settings: settingsBill.getSettings(),
       totals: settingsBill.totals(),
       addClass: addClass
    });
});


app.post('/settings', function(req, res){
console.log(req.body);

settingsBill.setSettings({
    callCost: req.body.callCost,
    smsCost: req.body.smsCost,
    warningLevel: req.body.warningLevel,
    criticalLevel: req.body.criticalLevel
});
// console.log(settingsBill.getSettings());

res.redirect('/');

});

app.post('/action' ,function(req, res){
 

    console.log(req.body.actionType);

    settingsBill.recordAction(req.body.actionType)




    res.redirect('/');

});
// app.get('/actions', function(req, res){
//     res.render('actions', {actions:settingsBill.actions()});
     

// });
app.get('/actions', function(req, res){
    var actionsMade = settingsBill.actions()
    actionsMade.forEach((element)=>{
        element.currentTime = moment(element.timestamp).fromNow()
    });
    res.render('actions',{actions:actionsMade});
});


app.get('/actions/:type', function(req, res){
const type= req.params.type
    const actions =settingsBill.actionsFor(type)
    
    actions.forEach(elem => {
        elem.currentTime = moment(elem.timestamp).fromNow()})
       
        res.render('actions',{actions:actions});



})
    



const PORT = process.env.PORT || 3011;

app.listen(PORT, function(){
    console.log("app started ")
});