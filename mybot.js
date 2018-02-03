const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");
const moment = require("moment");
const fs = require('fs');
const filename = "./data.json";
const data = require(filename);

client.on("ready", () => {
  console.log("I am ready!");
  //const channel = client.channels.find("id", "409153380838014979");
  const channel = client.channels.find("id", "409298926785658880");
  //console.log(channel)
  if(channel){
  	//channel.send(`Welcome to the channel`);

  	get_api(channel);
  	//repeat
  	setInterval(function() {
	  get_api(channel);
	}, 21600000);	// 6 hours
  }

});
/*
client.on("message", (message) => {
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
  }
});
*/

//client.login("NDA5MTUxNzE2MzgzMTI5NjEy.DVanbA.SlEDIM-POO8B4j4RWzlNE91WMVc");
client.login("NDA5MzY4MDUzNjU5NDY3Nzc5.DVdlSQ.FwA--_rhWkfRYk6mvoQcm-83PQw");

function get_api (channel) {
	console.log('Start get_api: ' + moment().format('YYYYMMDD HH:MM:SS'));

	var url = "http://www.coincalendar.info/wp-json/eventon/calendar?event_type=3&number_of_months=1&event_count=5&show_et_ft_img=yes"

	request({
	    url: url,
	    json: true
	}, function (error, response, body) {

	    if (!error && response.statusCode === 200) {
	        if(body.html){
	        	var api = body.html;

	        	while(api.length > 0){

		        	//get URL
		        	var n = api.indexOf('style="display:none" ><a itemprop=');
		        	var nn = api.indexOf('></a><span itemprop=');
		        	var event_url = '';
		        	if(n != -1 && nn != -1){
		        		event_url = api.substring(n + 47, nn - 2);
		        	}

			        var n1 = api.indexOf('<script type="application/ld+json">');
			        var n2 = api.indexOf('</script>');

			        if(n1 != -1 && n2 != -1){
			        	var results = api.substring(n1 + 35, n2)
			        	//results = results.split(",")
				        //results = results.replace(/ /g, '');
				        results = results.replace(/\r/g, '');
				        results = results.replace(/\n/g, '');
				        results = results.replace(/\t/g, '');

				        var last_comma = results.lastIndexOf(",");
				        results = results.substring(0, last_comma) + '}'
				        //console.log(results)
				        var json = JSON.parse(results);
				        //console.log(json)
				        if(json.startDate){
					        var tomorrow = moment().add(1, 'days').format('YYYYMMDD');
					        var event_date = moment(json.startDate, 'YYYY-M-DThh-mm-ss-00').format('YYYYMMDD');
					        if(event_date == tomorrow){
					        	var startDate = moment(json.startDate, 'YYYY-M-DThh-mm-ss-00').format('MMM Do YYYY')
					        	var desc = json.description;
					        	desc = desc.replace('&amp;', '&');
					        	var title = startDate + " | " + json.name;
					        	const embed = new Discord.RichEmbed()
									.setTitle(title)
									.setURL(event_url)
									.setDescription(desc)
									//.setFooter("www.coincalendar.info", "http://www.coincalendar.info/wp-content/uploads/2017/12/apple-touch.png")
									.setFooter("www.coincalendar.info", "https://lh3.googleusercontent.com/9pknD6CQXK0NJTVPqWJk-mYZryagt8I-Es2_o94_3DGvCXG6p_-yEMuMmNO8nXFiiF-4TH1xEjNwYWrOIXZ62bzjYBxBHcwl0spgxOn8KOncQbDJ7iU2VbAw-7ASOFfsO0WB1_bIYPMfzvSP9H55J959dGlgyKSJsKhzPsxgh7Ch_2QPVGCEtja8Snhe0Bv5IyUXPStzQxBmdF0K37oe8UBg071vd-MWrHrtkHLdnifGASXviTIEGadm-HtsoeEMYveS4Ajs-wsf_PIAclSbKN5UprgRO9TTn_rmUslPpBok2V13ZZRfsdcSVXKN87wvPqmTZGViotpU2d6yusGY8UWpqwNbF9MWXz_91zAqsknWPOpfQ3Ng75gRzWSWjMwYMsCCuDasYTXQzRRUFt-JalSv5qDUkOczzcm2uWyook8w4icFIujOwZaP6dj7ChpkpK1IkmM5ceKHwJ24XMq4sW2aKpqTNjZFWVALjA592tdzxg06F4B4Npdhw4HseediscA_OgE0RgtiKK-Dce7I_crMVvdHNWnvaKiBUTVUlvLgMLfTy3MwtNzOt0dKHaur_WEPRjpXTRlpck4EeWGS-Lw53Gnw9Yro37QVimt99qXSBW03NBW6i_K8D2Il47RvSdZgqEQPHCuoWaRzBXp-AsoL-qu8dB3M=s77-no")
									.setAuthor("Coin Calendar", "https://lh3.googleusercontent.com/9pknD6CQXK0NJTVPqWJk-mYZryagt8I-Es2_o94_3DGvCXG6p_-yEMuMmNO8nXFiiF-4TH1xEjNwYWrOIXZ62bzjYBxBHcwl0spgxOn8KOncQbDJ7iU2VbAw-7ASOFfsO0WB1_bIYPMfzvSP9H55J959dGlgyKSJsKhzPsxgh7Ch_2QPVGCEtja8Snhe0Bv5IyUXPStzQxBmdF0K37oe8UBg071vd-MWrHrtkHLdnifGASXviTIEGadm-HtsoeEMYveS4Ajs-wsf_PIAclSbKN5UprgRO9TTn_rmUslPpBok2V13ZZRfsdcSVXKN87wvPqmTZGViotpU2d6yusGY8UWpqwNbF9MWXz_91zAqsknWPOpfQ3Ng75gRzWSWjMwYMsCCuDasYTXQzRRUFt-JalSv5qDUkOczzcm2uWyook8w4icFIujOwZaP6dj7ChpkpK1IkmM5ceKHwJ24XMq4sW2aKpqTNjZFWVALjA592tdzxg06F4B4Npdhw4HseediscA_OgE0RgtiKK-Dce7I_crMVvdHNWnvaKiBUTVUlvLgMLfTy3MwtNzOt0dKHaur_WEPRjpXTRlpck4EeWGS-Lw53Gnw9Yro37QVimt99qXSBW03NBW6i_K8D2Il47RvSdZgqEQPHCuoWaRzBXp-AsoL-qu8dB3M=s77-no")
									.setImage(json.image);

								if(data.records){
									var records = data.records;
									var record_exist = false;
									for (var i = 0; i < records.length; i++) {
										if(records[i].name == title){
											record_exist = true;
											break;
										}
									}
									if(!record_exist){
										data.records.push({"name": title, "datetime": moment()})
										fs.writeFileSync(filename, JSON.stringify(data));
										console.log(title)
					        			channel.send({embed});
									}
								}
					        }
				        }
				        api = api.substring(n2 + 9, api.length)
			        }else{
			        	api = "";
			        }
	        	}
	        }
	    }
	})
}