//import required library
const fetch = require('node-fetch');

//declare path of json template
const PATH = "../json/";

const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;
const LINE_MESSAGING_API = process.env.LINE_MESSAGING_API;

const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
};


// IMPORT required json
const aboutus_main = require(PATH + "aboutus-main.json");
const aboutus_detail = require(PATH + "aboutus-detail.json");
const activity= require(PATH + "activity.json");
const PR = require(PATH + "public-relation-message1.json");
const work_in_progress = require(PATH + "work-in-progress.json");


module.exports = (req, res) => {
	//console.log(req.body)
	if (req.method === "POST") {
		if (req.body.events[0].type == "postback") {
			return handle_postback(req,res)
		}
		else return res.status(200).send(`Get`);
	}
	else return res.status(200).send(`Get`);
};

function handle_postback(req,res){
	
	let token = req.body.events[0].replyToken;
	let data = req.body.events[0].postback.data;
	
    switch (data){
		
        case "aboutus-main": return reply(token,res,aboutus_main); break;
        case "aboutus-detail": return reply(token,res,aboutus_detail); break;        
        case "activity": return reply(token,res,activity); break;
        case "PR": return reply(token,res,PR); break;
		default: return reply(token,res,work_in_progress); break;
		
    } 
}


function reply(reply_token,res,...msgs){
    
	
	let body = {
        replyToken: reply_token,
        messages: []
    };

	for (var msg of msgs){
		body.messages.push(msg);
	};
	
	return fetch(`${LINE_MESSAGING_API}/reply`,{
		
        method: 'POST',
        headers: LINE_HEADER,
        body: JSON.stringify(body)
		
    }).then(() => {
        return res.status(200).send(`Done`);
		
    }).catch((error) => {
		console.log(error);
        return res.status(500).send(error);
	})
}

function replyText(msg,reply_token,res) {
	
    let body = JSON.stringify({
       
	   replyToken: reply_token,
	   
        messages: [{
			
				type: 'text',
				text: msg
				
		}]
    });
	
    return fetch(`${LINE_MESSAGING_API}/reply`,{
        
		method: 'POST',
        headers: LINE_HEADER,
        body: body
		
    }).then(() => {
        return res.status(200).send(`Done`);
		
    }).catch((error) => {
		console.log(error);
        return res.status(500).send(error);
	})
} 

/*function redirectDialogflow(req,res){
  req.headers.host = "dialogflow.cloud.google.com";
  return fetch(dialogflowWebHook,{
	method: 'POST',
    headers: req.headers,
    body: JSON.stringify(req.body)
	}).then(() => {
        return res.status(200).send(`Done`);
	}).catch((error) => {
        return res.status(200).send('Done');})
	
}*/