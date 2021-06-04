//import required library
//const request = require('request-promise');

const fetch = require('node-fetch');

//get environment

//declare path of json template
const PATH = "../json/";

const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;
const LINE_MESSAGING_API = process.env.LINE_MESSAGING_API;
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
};

const dialogflowWebHook = process.env.DIALOGFLOW_API;

//depricated json
/*  const main = require("./template/json/main.json");
    const feed = require("./template/json/feed.json");
    const physical = require("./template/json/physical.json");
    const mind = require("./template/json/mind.json");
    const unwell = require("./template/json/unwell.json");
    const problem1 = require("./template/json/problem1.js");
    const problem2 = require("./template/json/problem2.js");
    const problem3 = require("./template/json/problem3.js");
    const problem4 = require("./template/json/problem4.js");
	const aboutus = require(PATH+"about-us.json");
	const contact = require(PATH+"contact.json");
	const newfeed = require(PATH+"new-feed.json");
	const project = require(PATH+"project.json");
	const physical = require(PATH+"physical.json");
	const mind = require(PATH+"mind.json");
	const unwell = require(PATH+"unwell.json");
*/

// IMPORT required json
const aboutus = require(PATH + "about-us-20072020.json");
const contact = require(PATH + "contact-13092020.json");
const workInProgress = require(PATH + "work-in-progress-20072020.json") 
const project = require(PATH + "project-20072020.json")
const illness = require(PATH + "illness-20072020.json");
const covid = require(PATH + "covid-20072020.json");
const normal = require(PATH + "normal-20072020.json");
const mind1 = require(PATH + "mind1-20072020.json");
const mind2 = require(PATH + "mind2-20072020.json");
const mind3 = require(PATH + "mind3-20072020.json");


module.exports = (req, res) => {
	//console.log(req.body)
	if (req.method === "POST") {
		if (req.body.events[0].message.type !== 'text') {
			res.status(200).send(`Get`);
		}
		return handle_text(req,res);
	}
	return res.status(200).send(`Get`);
};

/*function handle_postback(event, flow_state){
	
	switch (event.postback.data) {
		  
        case 'A1': reply(event.replyToken,main); break
        case 'A2': reply(event.replyToken,feed); break
		case 'A6': reply(event.replyToken,project); break
		case 'A7': reply(event.replyToken,unwell); break
		
		case 'A8': reply(event.replyToken,problem1);break
		case 'flow1': reply(event.replyToken,problem2);break
		case 'flow2':  flow_state = true; reply(event.replyToken,problem3);break
		
		case 'physical': reply(event.replyToken,physical); break
		case 'mind': reply(event.replyToken,mind); break
		
		default: reply(event.replyToken,event.postback.data); break
      }
	  
	  return flow_state;
}*/

function handle_text(req,res){
	
	let token = req.body.events[0].replyToken;
	let msg = req.body.events[0].message.text;
	
    switch (msg){
        case "เกี่ยวกับสพศ": reply(token,res,aboutus); break;
        case "ดูรายชื่อแยกฝ่าย": reply(token,res,contact); break;        
        case "รวมกิจกรรม": reply(token,res,workInProgress); break;
        case "เปิด-ปิดโครงการ": reply(token,res,project); break;
        case "ป่วยกาย-ไม่สบายใจ": reply(token,res,illness); break;
        case "กาย": reply(token,res,normal,covid); break;
        case "ใจ": reply(token,res,mind1,mind2,mind3); break;
        //case "แจ้งปัญหา": replyText("แจ้งปัญหา",token,res); break;

        default : redirectDialogflow(req,res);
		//default: replyText("ขออภัย",token,res); break;
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
        return res.status(500).send(error);})
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
        return res.status(500).send(error);})

} 

function redirectDialogflow(req,res){
  req.headers.host = "dialogflow.cloud.google.com";
  return fetch(dialogflowWebHook,{
	method: 'POST',
    headers: req.headers,
    body: JSON.stringify(req.body)
	}).then(() => {
        return res.status(200).send(`Done`);
	}).catch((error) => {
        return res.status(200).send('Done');})
	
}