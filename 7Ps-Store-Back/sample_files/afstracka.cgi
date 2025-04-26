var defafs=document.getElementsByTagName('script')[0];
var AFS_Protocol="http:";
if (document.location.protocol == "https:") AFS_Protocol="https:";
var codeAFS="<a href='//new.afsanalytics.com' rel='nofollow'><img src='"+AFS_Protocol+"//www.afsanalytics.com/afsdisplay/bad.gif' border='0'  alt='AFS Analytics'></a>";
var codeins= document.createElement('div');
codeins.innerHTML = codeAFS;
statdivafs =document.getElementById("addfreestats");
if (statdivafs==null) { defafs.parentNode.insertBefore(codeins,defafs);}
else {
statdivafs.style.visibility='visible';
statdivafs.style.lineHeight='0';
statdivafs.style.height='0';
statdivafs.style.fontSize='0';
statdivafs.innerHTML = codeAFS;
statdivafs.parentNode.insertBefore(codeins,statdivafs);
}
