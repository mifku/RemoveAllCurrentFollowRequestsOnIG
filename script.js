const UNFOLLOW_TEXT = "Unfollow";
const REQUESTED_TEXT = "Requested";
const VIEWMORE_TEXT ="View More"; 



function findButton(node,buttonText,nodeType){
  var aTags
  if(nodeType == "iframe"){
    aTags = node.contentWindow.document.getElementsByTagName("button");
  }
  else{
     aTags = document.getElementsByTagName("button");
  }
var searchText = buttonText;
var found;

for (var i = 0; i < aTags.length; i++) {
  if (aTags[i].textContent == searchText) {
    found = aTags[i];
    break;
  }
}
return found;
}

function requested(iframe,profileName){
  
  var found = findButton(iframe,REQUESTED_TEXT,"iframe");
if(found){
  found.click();
  console.log("Requested button clicked : "+profileName);
}
else
{
  console.log("Requested button not found : "+profileName);
}
}

function checkIfRequestedDisappeared()
{
 
}

function unfollow(iframe,profileName){
  
var unfollowButton = findButton(iframe,UNFOLLOW_TEXT,"iframe");
if(unfollowButton){
  unfollowButton.click();
  console.log("Unfollow button clicked : "+profileName);
}else{
 console.log("Unfollow button not found : "+profileName);
}

var checkIfRequestedDisappearedInterval =setInterval(() => {
  var found = findButton(iframe,REQUESTED_TEXT,"iframe");
  if(found==undefined)
  {
    clearInterval(checkIfRequestedDisappearedInterval);
    killIframe(profileName);
  }
}, 500);

} 

function killIframe(profileName){
  
  var myobj = window.top.document.getElementById("iframe_"+profileName);
  myobj.remove();
  console.log("IFrame removed : "+profileName);
}

function frameLoaded(profileName){
  var iframe = window.top.document.getElementById("iframe_"+profileName);
  requested(iframe,profileName);  
  unfollow(iframe,profileName);  
}
 function prepareFrame(profileName) {
        var ifrm = document.createElement("iframe");

        ifrm.setAttribute("src", "https://www.instagram.com/"+profileName);
        ifrm.setAttribute("id" , "iframe_"+profileName);
        ifrm.setAttribute("onload" , "frameLoaded('"+profileName+"')");
        ifrm.style.width = "640px";
        ifrm.style.height = "480px";
        document.body.appendChild(ifrm);
}
 function getFollowRequestNames(){  

   var clickButtonInterval = setInterval(() => {
    var button = findButton(window,VIEWMORE_TEXT,"node");
    if(button && button.disabled == false){
      button.click();
    }
    else if(button == undefined)
    {
      clearInterval(clickButtonInterval);
      var profileNames = Array.from(document.querySelectorAll('section > div'), e => e.innerText);
      console.log("Count of Users : " + profileNames.length);

      (function loop() {
        var rand = Math.round(Math.random() * (5000)) + 25000;
        setTimeout(function() {
          
          console.log(profileNames.length + " Remaining Users");
  
          
          var profileName = profileNames.pop();
          console.log("Preparing For : " + profileName);
          prepareFrame(profileName);  
          if(profileNames.length==0)
          {
            console.log("Profile Names Empty");
          }else{
            loop();
          }
          
        }, rand);
      }());
    }
  }, 500); 
}

getFollowRequestNames();
