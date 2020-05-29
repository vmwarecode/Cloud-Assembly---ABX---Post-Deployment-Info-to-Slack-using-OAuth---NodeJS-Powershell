//#--------------------------------------------------------#
//#                     Spas Kaloferov                     #
//#                   www.kaloferov.com                    #
//# bit.ly/The-Twitter      Social     bit.ly/The-LinkedIn #
//# bit.ly/The-Gitlab        Git         bit.ly/The-Github #
//# bit.ly/The-BSD         License          bit.ly/The-GNU #
//#--------------------------------------------------------#

  //#
  //#       VMware Cloud Assembly ABX Code Sample          
  //#
  //# [Info] 
  //#   - Action posts Cloud Assembly deployment info in a Slack channel via OAuth.
  //#   - It posts IP Address and Resource Name. 
  //#   - Can be tested from within the ABC Action without deployment payload
  //# [Inputs]
  //#   - slackTokenIn (String): Slack Auth Bot Token
  //#   - slackChannelIn (String): Slack Channel
  //# [Outputs]
  //# [Dependency]
  //#   - Requires: requests,datetime
  //# [Subscription]
  //#   - Event Topics:
  //#      - compute.provision.post  
  //# [Thanks]
  //#

// ----- Global ----- //
// ----- Functions  ----- //


exports.handler = function handler(context, inputs) {   // Function posts to Slack
    let fn = "handler -";    // Holds the funciton name. 
    console.log("[ABX] "+fn+" Action started.");
    console.log("[ABX] "+fn+" Function started.");
    
    // ----- Inputs ----- //
    
    let slackToken = inputs.slackTokenIn;    // Slack Bot Auth Token 
    let slackChannel = inputs.slackChannelIn;   // Slack Channel Name
    
    // ----- Script ----- //

    let https = require('https');    
    let messageHeading = "";
    let parentMessage = "";
    let colorHex = "#36a64";
    let authorName = "Tito";
    let authorLink = "http://gitlab.elasticskyholdings.com/class-delivery/tito";
    let authorIcon = "http://gitlab.elasticskyholdings.com/class-delivery/lab-files/raw/master/code-stream/images/tito-v2-app-icon.png";
    let slackThread = [];
    let cspDeploymentUrl = "";
    let message = "";
    
    
    function getSafe(fn, defaultVal) {  // Function to savely check if parameter/objec texists
        try {
            return fn();
        } catch (e) {
            return defaultVal;
        }
    }
    
    // Check If Payload exists
    if ( getSafe(() => inputs.customProperties.slackThreadProp) !== undefined) {
        slackThread = inputs.customProperties.slackThreadProp;
    } else {
        slackThread = "";
    }

    if ( getSafe(() => inputs.deploymentId) !== undefined) {
        cspDeploymentUrl ="https://www.mgmt.cloud.vmware.com/automation-ui/#/deployment-ui;ash=%2Fdeployment%2F"+inputs.deploymentId;
        message = '<'+cspDeploymentUrl+'|Deployment> triggered by '+inputs.__metadata.userName+'\n*Name:* '+inputs.resourceNames+'\n*IP:* <http://'+inputs.addresses+'|'+inputs.addresses+'> \n*Status:* completed sucessfully :ok_hand:';        
    } else {
        message = "No Deployment Payload, but <http://www.kaloferov.com/|Spas Is Awsome>";
    }

    console.log("[ABX] "+fn+" Slack message: " + message);
    console.log("[ABX] "+fn+" Slack thread: " + slackThread);

    // Body
    let slackPayload = JSON.stringify(
        {
            channel: slackChannel, // Slack user or channel, where you want to send the message
            text: parentMessage,
            thread_ts: slackThread,
            attachments: [
                {
                    "fallback": "Cloud Assembly deployment",
                    "color": colorHex,
                    "title": messageHeading,
                    "text": message,
                    "ts": slackThread,
                    "author_name": authorName,
                    "author_link": authorLink,
                    "author_icon": authorIcon
                }
            ]
        }
    );

    // Call Body Attachments 
    const options = {
        hostname: 'slack.com',
        port: 443,
        path: '/api/chat.postMessage',
        method: 'POST',
        headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(slackPayload),
        "Authorization": "Bearer " + slackToken,
    }
    };

    // Call
    const req = https.request(options, (res) => {
        //    context.setOutput("statusCode", res.statusCode);
        let data = '';
        // A chunk of data has been recieved.
        res.on('data', (chunk) => {
            data += chunk;
        });
        
    });
    req.on('error', (e) => {
    console.error(e);
    });
    
    // ----- Outputs ----- //
    
    console.log("[ABX] "+fn+" Function completed.");
    console.log("[ABX] "+fn+" Action completed.");
    
    req.write(slackPayload);    // Return response 
    req.end();

};  // End Function 