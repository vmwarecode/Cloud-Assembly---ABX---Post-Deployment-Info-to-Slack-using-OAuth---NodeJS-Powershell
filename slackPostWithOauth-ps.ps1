#--------------------------------------------------------#
#                     Spas Kaloferov                     #
#                   www.kaloferov.com                    #
# bit.ly/The-Twitter      Social     bit.ly/The-LinkedIn #
# bit.ly/The-Gitlab        Git         bit.ly/The-Github #
# bit.ly/The-BSD         License          bit.ly/The-GNU #
#--------------------------------------------------------#

  #
  #       VMware Cloud Assembly ABX Code Sample          
  #
  # [Info] 
  #   - Action posts Cloud Assembly deployment info in a Slack channel via OAuth.
  #   - It posts IP Address and Resource Name. 
  #   - Can be tested from within the ABC Action without deployment payload
  # [Inputs]
  #   - slackTokenIn (String): Slack Auth Bot Token
  #   - slackChannelIn (String): Slack Channel
  # [Outputs]
  # [Dependency]
  # [Subscription]
  #   - Event Topics:
  #      - compute.provision.post  
  # [Thanks]
  #   - Radostin Georgiev (https://www.linkedin.com/in/radostin-georgiev-1b4a9746) 
  #

# ----- Global ----- # 
# ----- Functions  ----- # 

function handler($context, $payload) {   # Function posts to Slack

    $fn = "handler -"    # Holds the funciton name. 
    Write-Host "[ABX] "+$fn+" Action started."
    Write-Host "[ABX] "+$fn+" Function started."

    # ----- Inputs ----- #
    
    $slackToken = $payload.slackTokenIn    # Slack Auth Bot Token
    $slackChannel = $payload.slackChannelIn     # Slack Channel

    # ----- Script ----- #

    $url = 'https://slack.com/api/chat.postMessage'
    $contentType = 'application/json; charset=utf-8'
    $method = 'POST'
    $headers = @{"Authorization"="Bearer $slackToken"}
    
    # Body Attachment
    $messageHeading = ''    # Message Heading
    $parentMessage = ''     # Parent Message
    $colorHex = '#e5a70b'
    $authorName = 'Tito'
    $authorLink = 'http://gitlab.elasticskyholdings.com/class-delivery/tito'
    $authorIcon = 'http://gitlab.elasticskyholdings.com/class-delivery/lab-files/raw/master/code-stream/images/tito-v2-app-icon.png'
    $slackThread = ''

    # Enables to test action without payload
    if ($payload.customProperties.slackThreadProp -eq $null) {
        $slackThread = ''
    } else {
        $slackThread = $payload.customProperties.slackThreadProp
    }

    if ( ($payload.resourceNames.Count -gt 0) -or ($payload.addresses.Count -gt 0) ) {
        $cspDeploymentUrl = 'https://www.mgmt.cloud.vmware.com/automation-ui/#/deployment-ui;ash=%2Fdeployment%2F' + $payload.deploymentId
        $message = "<" + $cspDeploymentUrl + "|Deployment> triggered by " + $payload.__metadata.userName + "`n *Name:* " + $payload.resourceNames[0] + "`n * IP:* <http://" + $payload.addresses[0] + "|" + $payload.addresses[0] + "> `n *Status:* completed sucessfully :ok_hand:";
    } else {
        $message = "No Deployment Payload, but <http://www.kaloferov.com/|Spas Is Awsome>"
    }
    
    Write-Host "[ABX] "+$fn+" Slack message: " + $message
    
    $fallback = $message
    
    # Body 
    $body = ConvertTo-Json @{
        fallback = $fallback
        channel = $slackChannel
        color = $color
        title = $messageHeading
        text = $message
        ts = $slackThread
        author_name = $author_name 
        author_link = $author_link
        author_icon = $author_icon

    }
    
    # Alternativly you can use Invoke-RestMethod and [void]() to suppres output 
    # e.g. Invoke-WebRequest -Uri $url -Headers $headers -Method $method -ContentType $contentType -Body $body
    # Invoke-RestMethod: https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-restmethod?view=powershell-7
    # Invoke-WebRequest: https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest?view=powershell-7
    $response = Invoke-RestMethod -ContentType $contentType -Uri $url -Headers $headers -Method $method -Body $body -UseBasicParsing        # Call
    
    # ----- Outputs ----- #
    
    Write-Host "Message has been sent."
    Write-Host "[ABX] "+$fn+" Function completed."
    Write-Host "[ABX] "+$fn+" Action completed."
    Write-Host "[ABX] "+$fn+" P.S. Spas Is Awesome !!!"
    
    return $response    # Return response 
}   # End Function    

